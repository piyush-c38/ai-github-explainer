# Contributing to AI GitHub Repository Explainer

We welcome contributions from the community! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

## How to Contribute

1.  **Fork the Repository**: Start by forking the main repository to your own GitHub account.
2.  **Clone the Fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/ai-github-explainer.git
    cd ai-github-explainer
    ```
3.  **Create a Branch**: Create a new branch for your changes. Use a descriptive name.
    ```bash
    git checkout -b feature/my-new-feature
    ```
4.  **Make Your Changes**: Implement your changes, following the existing code style.
5.  **Commit Your Changes**: Commit your changes with a clear and concise commit message.
    ```bash
    git commit -m "feat: Add my new feature"
    ```
6.  **Push to Your Fork**: Push your changes to your forked repository.
    ```bash
    git push origin feature/my-new-feature
    ```
7.  **Open a Pull Request**: Go to the original repository and open a pull request from your forked branch. Provide a detailed description of the changes you've made.

## Future Roadmap

This project is an MVP, and there are many ways it can be improved and extended. Here are some ideas for future development:

### Core Features

*   **Support for Private Repositories**: Implement OAuth to allow users to analyze their private GitHub repositories.
*   **Deeper Language Support**: Add `tree-sitter` parsers for more languages (e.g., Python, Java, Go) to provide more accurate analysis.
*   **Enhanced RAG**:
    *   Implement a more sophisticated chunking strategy for code to improve context retrieval.
    *   Allow the RAG system to answer questions about specific commits or branches.
*   **Real-time Collaboration**: Allow multiple users to view and interact with the same analysis session.

### Visualizations

*   **Interactive Dependency Graph**: Allow users to click on nodes in the dependency graph to see more information or navigate to the relevant file.
*   **Historical Analysis**: Show how the repository's structure and dependencies have changed over time.
*   **Code "Hotspots"**: Visualize which files have been changed most frequently.

### Performance & Scalability

*   **Caching**: Implement caching for analysis results to avoid re-analyzing repositories that haven't changed.
*   **Background Jobs**: Move the analysis process to a more robust background job queue (e.g., BullMQ) instead of handling it in-process.
*   **Streaming Responses**: Stream analysis results and chat responses to the frontend for a more responsive UI.

### Documentation & Usability

*   **More In-depth Documentation**: Add more detailed documentation for each feature.
*   **Guided Tours**: Create guided tours to help new users understand how to use the application.

We encourage you to pick up any of these ideas or propose your own!
