# CodeGuard 🛡️

**An AI-Powered Code Plagiarism Detection System for Educators and Institutions**

CodeGuard is an advanced, intelligent platform that revolutionizes how academic integrity is maintained in programming courses. Using a sophisticated multi-algorithm machine learning pipeline, real-time code comparison, and interactive statistical dashboards, CodeGuard enables educators to easily detect code similarities and uncover sophisticated plagiarism attempts.

## 🌟 Key Features

### For Educators & Instructors
- 📂 **Bulk Code Analysis** - Upload multiple student code submissions simultaneously and run comprehensive batch comparisons.
- 🧠 **Multi-Algorithm Detection** - Accurate analysis using Levenshtein, Sequence Matching, Cosine Similarity, and Jaccard Similarity.
- 📊 **Risk Assessment** - Submissions are automatically classified into High, Medium, and Low risk brackets for quick triage.
- 📈 **Interactive Dashboards** - Visualize similarity distributions, assignment-wise breakdowns, and top suspects rankings.
- 📋 **Detailed Comparison Reports** - Side-by-side metric breakdowns (lexical, AST, semantic) for transparent, defensible grading.
- 🔐 **Secure Authentication** - Robust JWT-based login and registration system protecting sensitive academic data.
- 📥 **Exportable Analytics** - Download detailed reports in JSON/CSV formats for institutional record-keeping.

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, Tailwind CSS  
**Backend:** Python, FastAPI, Uvicorn  
**Database:** MongoDB Atlas (Motor async driver)  
**Machine Learning:** scikit-learn, python-Levenshtein  
**Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Live Demo

**Experience CodeGuard now:**
- **Website:** https://codeguard-frontend.vercel.app *(Replace with actual link if available)*

**This is a demonstration project.** If you'd like to learn more about the implementation or discuss similar projects, feel free to contact us.

## 🧠 Plagiarism Detection Engine

CodeGuard utilizes a powerful 4-layered machine learning pipeline to detect even the most obfuscated code copying:
- **Sequence Matching (30% Weight):** Identifies structural similarities and longest matching subsequences.
- **TF-IDF + Cosine Similarity (30% Weight):** Vectorizes code to detect deep semantic similarity and n-gram overlap.
- **Levenshtein Distance (20% Weight):** Measures character-level edit distance to catch exact and near-exact copies.
- **Jaccard Similarity (20% Weight):** Computes token overlaps to remain robust against code reordering.

## 🔐 Security

- JWT-based authentication
- Password encryption (bcrypt)
- Secure CORS protection
- Data privacy for student submissions

## 📊 Analytics & Reporting

- Real-time aggregated statistics across all assignments
- Top-at-risk student pair identification
- Historical trend tracking over the academic term
- Similarity network graphs

## ✨ What Makes CodeGuard Special

- **Comprehensive Detection** - Replaces single-algorithm tools that miss variable renaming or structural changes.
- **Real-Time Processing** - Capable of processing hundreds of submissions asynchronously in seconds.
- **Actionable Insights** - Not just raw percentages; provides exact risk categories and deep-dive metric breakdowns.
- **Professional Platform** - Clean, intuitive, modern interface built for non-technical educators.

## 📧 Support & Suggestions

Have suggestions or feedback? We'd love to hear from you!
- **Email:** saravanank20051012@gmail.com
- **Report Issues:** [GitHub Issues](https://github.com/Saravanank2005/CodeGuard_Frontend/issues)

**Note:** For questions, feature requests, or collaboration opportunities, please contact us via email.

## 📄 License

ISC License - Personal Use Only

## 🙏 Built With

- Next.js & React
- Python & FastAPI
- scikit-learn
- MongoDB
- Tailwind CSS

---

**Made with ❤️ by the CodeGuard Team**

[Report Issue](https://github.com/Saravanank2005/CodeGuard_Frontend/issues) • [Suggest Feature](mailto:saravanank20051012@gmail.com)
