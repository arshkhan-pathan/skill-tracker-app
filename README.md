# Skill Tracker - Your Learning Journey Manager

A comprehensive, modern application to help you define, manage, and track learning new skills. Built with Next.js 15, TypeScript, and a beautiful UI powered by shadcn/ui.

## Features

- **Kanban Board**: Visualize your skills across four stages - To Learn, Learning, Practiced, and Mastered
- **Drag & Drop**: Easily move skills between stages with intuitive drag-and-drop functionality
- **Progress Tracking**: Track your learning progress with visual progress bars
- **Milestone Management**: Set and track milestones for each skill
- **Resource Library**: Attach learning resources (articles, videos, courses, books) to each skill
- **Dashboard**: Beautiful data visualizations with charts showing your learning statistics
- **Category System**: Organize skills by predefined categories (Programming, Web Dev, Mobile, AI/ML, Cloud, Design, etc.)
- **Time Tracking**: Track time invested in each skill
- **Activity Log**: View recent activity and progress history
- **Local Storage**: All data is stored locally in your browser using Zustand persistence

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand with persistence
- **Drag & Drop**: @hello-pangea/dnd (React Beautiful DnD fork)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd skill-tracker-app
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a Skill

1. Click the "Add Skill" button in the top right corner
2. Fill in the skill details:
   - **Basic Info**: Title, description, category, status, progress, time spent, target date, and tags
   - **Milestones**: Add checkpoints to track your learning journey
   - **Resources**: Attach learning materials (URLs to articles, videos, courses, etc.)
3. Click "Create Skill" to save

### Managing Skills

- **Drag & Drop**: Simply drag skill cards between columns to update their status
- **Edit**: Click on any skill card to edit its details
- **Delete**: Open a skill and click the "Delete" button
- **Progress**: Update progress percentage using the slider in the edit dialog
- **Milestones**: Check off milestones as you complete them

### Dashboard

Switch to the Dashboard tab to view:
- Total skills count and learning statistics
- Average progress across all skills
- Total time invested
- Skills distribution by status (Pie chart)
- Skills distribution by category (Bar chart)
- Recent activity feed

### Sample Data

On first launch, you'll see an option to load sample skills to explore the features. This includes:
- TypeScript learning
- React Hooks mastery
- Python Machine Learning
- Docker & Kubernetes
- UI/UX Design
- Git Advanced Workflows

## Project Structure

```
skill-tracker-app/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles and Tailwind CSS
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── kanban-board.tsx     # Kanban board with drag & drop
│   ├── dashboard.tsx        # Dashboard with charts
│   ├── skill-dialog.tsx     # Skill creation/edit dialog
│   └── sample-data-seeder.tsx # Sample data loader
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── store.ts             # Zustand store with persistence
│   ├── utils.ts             # Utility functions
│   └── data/
│       └── categories.ts    # Predefined skill categories
└── public/                  # Static assets
```

## Features in Detail

### Skill Categories

The app comes with 10 predefined categories:
1. Programming Languages
2. Web Development
3. Mobile Development
4. Data Science & AI
5. Cloud & DevOps
6. Design
7. Database
8. Security
9. Tools & Frameworks
10. Soft Skills

You can add custom categories through the store.

### Data Persistence

All data is stored locally in your browser using localStorage through Zustand's persist middleware. Your data will persist across browser sessions but won't be synced across devices.

### Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (below 768px)

## Build for Production

```bash
npm run build
npm start
```

## Customization

### Adding Custom Categories

Edit `lib/data/categories.ts` to add or modify categories.

### Styling

The app uses Tailwind CSS v4. Modify `app/globals.css` for custom theme colors and styles.

### UI Components

All UI components are from shadcn/ui and can be customized in the `components/ui/` directory.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on the repository.

---

Built with Next.js and shadcn/ui
