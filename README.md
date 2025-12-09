# 🚀 AI Cover Letter Nexus

A sophisticated Single Page Application (SPA) that generates tailored, professional cover letters using Google Gemini AI. Transform your resume and job description into a perfectly crafted cover letter in seconds.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff)

## ✨ Features

- 🤖 **AI-Powered Generation** - Leverages Google Gemini 2.5 Flash for intelligent cover letter creation
- 🔒 **Privacy First** - All file processing happens client-side in your browser
- 📄 **Multi-Format Support** - Upload PDF, DOCX, TXT, or MD files
- 🎨 **Modern UI** - Dark-themed, responsive interface with smooth animations
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ✏️ **Editable Output** - Refine the generated letter before exporting
- 💾 **Multiple Export Options** - Download as TXT or professionally formatted PDF
- ⚡ **Fast & Efficient** - Reduces drafting time from hours to seconds

## 🛠️ Technology Stack

### Core Technologies
- **TypeScript 5.x** - Type-safe development
- **React 19** - Modern UI with functional components and hooks
- **Tailwind CSS** - Utility-first styling framework
- **Vite** - Lightning-fast build tool

### Key Libraries
- **@google/genai** - Google Gemini API integration
- **pdfjs-dist** - Client-side PDF text extraction
- **mammoth.js** - DOCX file parsing
- **jspdf** - PDF generation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MD-Abdul-Raheem/AI_Cover_Letter_Builder.git
cd AI_Cover_Letter_Builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## 📖 How to Use

1. **Add Job Description** - Paste or upload the job posting
2. **Add Your Resume** - Paste or upload your resume (PDF, DOCX, TXT, MD)
3. **Customize (Optional)** - Add specific instructions like "Emphasize leadership skills"
4. **Generate** - Click the generate button and wait a few seconds
5. **Edit & Export** - Review, edit if needed, and download as TXT or PDF

## 🎯 Key Advantages

- **Data Privacy** - No backend storage, all processing happens locally
- **Precision** - AI strictly adheres to facts from your resume
- **Professional Formatting** - Business-standard PDF output
- **Time-Saving** - Generate quality cover letters in seconds
- **Customizable** - Add specific instructions to tailor the tone and focus

## 📁 Project Structure

```
AI_Cover_Letter_Builder/
├── components/
│   ├── Icons.tsx           # SVG icon components
│   ├── InputCard.tsx       # Reusable input component
│   └── OutputSection.tsx   # Generated letter display
├── services/
│   └── geminiService.ts    # Gemini API integration
├── App.tsx                 # Main application component
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite for fast development and optimized builds. Environment variables are injected at build time through `vite.config.ts`.

### Tailwind Configuration

Custom color scheme and utilities are configured in `index.html` using Tailwind's CDN with custom configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini AI for powerful language generation
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- All open-source contributors

## 📧 Contact

MD Abdul Raheem - [@MD-Abdul-Raheem](https://github.com/MD-Abdul-Raheem)

Project Link: [https://github.com/MD-Abdul-Raheem/AI_Cover_Letter_Builder](https://github.com/MD-Abdul-Raheem/AI_Cover_Letter_Builder)

---

⭐ If you find this project helpful, please consider giving it a star!
