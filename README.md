# CodeGuard Frontend 🛡️

CodeGuard is an intelligent, AI-powered code plagiarism detection system designed to identify similarities in student programming assignments. This repository contains the **Frontend** application, built with modern web technologies to provide an intuitive, responsive, and real-time dashboard for educators and instructors.

## 🌟 Key Features

- **Secure Authentication:** JWT-based login and registration system.
- **Bulk Code Analysis:** Upload multiple code files simultaneously and run batch comparisons.
- **Real-Time Detection Results:** Get immediate similarity scores calculated using Levenshtein Distance, Sequence Matching, Cosine Similarity, and Jaccard Similarity on the backend.
- **Risk-Based Categorization:** Submissions are automatically classified into High, Medium, and Low risk.
- **Interactive Dashboards:** Statistical visualizations, top suspects ranking, and assignment-wise breakdowns.
- **Detailed Reports:** Side-by-side metric breakdowns (lexical, AST, semantic) and downloadable JSON reports.

## 🛠️ Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Backend Integration:** Interacts with a Python/FastAPI backend API.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saravanank2005/CodeGuard_Frontend.git
   cd CodeGuard_Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory of the project. **Do not commit your actual keys to version control!** Add the following variables with your specific configuration:

   ```env
   # API endpoint for the CodeGuard Backend
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   
   # Add any other required environment variables here
   # NEXT_PUBLIC_SOME_KEY=your_value_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 🤝 Contribution Guidelines

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📬 Support & Contact

If you have any questions, suggestions, or need support regarding this project, feel free to reach out via email:

**Email:** [saravanank20051012@gmail.com](mailto:saravanank20051012@gmail.com)
