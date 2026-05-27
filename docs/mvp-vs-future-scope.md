# MVP vs. Future Scope

## MVP Scope

The goal of the MVP is to deliver a functional product that provides real value to users with a limited set of core features.

### Core Features for MVP:

1.  **GitHub Repo Ingestion:** Users can paste a public GitHub repository URL.
2.  **Basic Structural Analysis:**
    *   Folder and file structure visualization.
    *   List of dependencies (from `package.json`, `requirements.txt`, etc.).
3.  **Basic RAG Chat:** A chat interface to ask simple questions about the code.
4.  **File Explanation:** Ability to select a file and get a summary of its purpose.
5.  **Architecture Diagram:** A high-level architecture diagram generated with Mermaid.
6.  **One or two interactive graphs:** Folder structure and dependency graphs.

### Technology for MVP:

*   **Languages:** Focus on parsing and analyzing JavaScript/TypeScript and Python initially.
*   **Database:** Local ChromaDB is sufficient.
*   **Deployment:** A simple, free deployment option.

## Future Scope

Once the MVP is successful and we have user feedback, we can expand the feature set.

### Potential Future Features:

1.  **Enhanced Analysis:**
    *   **Code Flow Visualization:** Detailed data flow and execution path analysis.
    *   **Component Relationship Graphs:** For frameworks like React, Vue, Angular.
    *   **Bug Detection:** Static analysis to find potential bugs and code smells.
    *   **Performance Analysis:** Identify performance bottlenecks.
2.  **Improved Onboarding:**
    *   **"Good First Issue" Suggestions:** Integrate with GitHub issues to suggest good first issues for new contributors.
    *   **Personalized Learning Paths:** More detailed and interactive onboarding paths.
3.  **Advanced RAG:**
    *   **Multi-document Summarization:** Summarize information across multiple files.
    *   **More sophisticated prompting:** To handle more complex queries.
4.  **User Accounts and History:**
    *   Allow users to create accounts and save their analysis history.
    *   Private repository analysis.
5.  **Wider Language Support:** Add support for more programming languages in the parser pipeline.
6.  **CI/CD Integration:** Integrate with GitHub Actions to automatically analyze repositories on push.
7.  **Team Collaboration Features:** Allow teams to share and discuss repository analysis.
8.  **VS Code Extension:** A VS Code extension for in-editor analysis.
