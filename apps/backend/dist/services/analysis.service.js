"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisService = void 0;
const crypto_1 = require("crypto");
const github_service_1 = require("./github.service");
const parser_service_1 = require("./parser.service");
const embedding_service_1 = require("./embedding.service");
const vector_service_1 = require("./vector.service");
const errors_1 = require("../lib/errors");
class AnalysisService {
    constructor() {
        this.analyses = new Map();
    }
    async startAnalysis(repoUrl) {
        const analysisId = (0, crypto_1.randomUUID)();
        this.analyses.set(analysisId, {
            analysisId,
            repoUrl,
            status: 'pending',
        });
        void this.runAnalysis(analysisId, repoUrl);
        return analysisId;
    }
    getAnalysisResult(analysisId) {
        return this.analyses.get(analysisId);
    }
    async runAnalysis(analysisId, repoUrl) {
        this.analyses.set(analysisId, {
            analysisId,
            repoUrl,
            status: 'processing',
        });
        try {
            const result = await this.analyzeRepo(repoUrl);
            this.analyses.set(analysisId, {
                analysisId,
                repoUrl,
                status: 'completed',
                ...result,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.analyses.set(analysisId, {
                analysisId,
                repoUrl,
                status: 'failed',
                error: message,
            });
        }
    }
    async analyzeRepo(repoUrl) {
        try {
            const localPath = await github_service_1.githubService.cloneRepo(repoUrl);
            const files = await github_service_1.githubService.scanFiles(localPath);
            const collectionName = repoUrl.replace(/[^a-zA-Z0-9]/g, '_');
            const parsedData = [];
            for (const file of files) {
                const data = await parser_service_1.parserService.parseFile(file);
                if (data) {
                    parsedData.push(data);
                }
            }
            const embeddings = await embedding_service_1.embeddingService.generateEmbeddingsForFiles(files);
            const documents = embeddings.map((emb, index) => ({
                id: `${emb.filePath}-${index}`,
                embedding: emb.embedding,
                metadata: {
                    filePath: emb.filePath,
                    content: emb.content,
                },
            }));
            await vector_service_1.vectorService.addDocuments(collectionName, documents);
            const dependencies = parsedData.reduce((acc, data) => {
                return { ...acc, [data.filePath]: data.dependencies };
            }, {});
            return {
                message: 'Analysis complete',
                collectionName,
                dependencies,
                files,
                parsedData,
            };
        }
        catch (error) {
            console.error('Repository analysis failed:', error);
            if (error instanceof errors_1.ApiError) {
                throw error;
            }
            throw new errors_1.ApiError(500, 'Repository analysis failed');
        }
    }
}
exports.analysisService = new AnalysisService();
