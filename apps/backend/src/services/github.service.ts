import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';
import config from '../config';
import { ApiError } from '../lib/errors';

class GitHubService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async cloneRepo(repoUrl: string): Promise<string> {
    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'repo';
    const localPath = path.join(config.clonePath!, repoName);

    if (fs.existsSync(localPath)) {
      console.log(`Repository already exists at ${localPath}. Skipping clone.`);
      return localPath;
    }

    try {
      await this.git.clone(repoUrl, localPath);
      console.log(`Cloned repository to ${localPath}`);
      return localPath;
    } catch (error) {
      console.error('Failed to clone repository:', error);
      throw new ApiError(500, 'Failed to clone repository');
    }
  }

  async scanFiles(localPath: string): Promise<string[]> {
    const allFiles: string[] = [];
    const walk = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // Ignore node_modules and .git
          if (file !== 'node_modules' && file !== '.git') {
            walk(filePath);
          }
        } else {
          allFiles.push(filePath);
        }
      }
    };

    walk(localPath);
    return allFiles;
  }
}

export const githubService = new GitHubService();
