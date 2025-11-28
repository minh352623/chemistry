# 🧪 Chemistry Reaction Simulator

An interactive web-based chemistry laboratory where you can mix chemicals, trigger reactions, and witness stunning visual effects in a safe, virtual environment.

![Chemistry Simulator](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- **12+ Chemicals**: Acids, bases, salts, metals, and organic compounds
- **10+ Reactions**: Neutralization, precipitation, gas evolution, color changes, and explosions
- **Visual Effects System**: Real-time particle effects (bubbles, smoke, precipitates, explosions)
- **Drag & Drop Interface**: Intuitive chemical mixing system
- **Educational Content**: Detailed explanations for each reaction
- **Experiment History**: Track all your experiments with localStorage persistence
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Safety Warnings**: Clear indicators for dangerous reactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd chemistry-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
chemistry-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── lab/page.tsx       # Main lab simulator
│   │   ├── history/page.tsx   # Experiment history
│   │   ├── about/page.tsx     # About & documentation
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles & animations
│   │
│   ├── components/
│   │   ├── lab/
│   │   │   ├── LabInterface.tsx    # Main lab container
│   │   │   ├── BeakerCanvas.tsx    # Canvas-based beaker
│   │   │   ├── Beaker.tsx          # Beaker drop zone
│   │   │   ├── ChemicalShelf.tsx   # Chemical selector
│   │   │   ├── ChemicalBottle.tsx  # Draggable chemical
│   │   │   ├── LabControls.tsx     # Mix/Heat/Stir buttons
│   │   │   └── ReactionPanel.tsx   # Reaction info display
│   │   └── Navigation.tsx      # Site navigation
│   │
│   ├── engine/
│   │   └── reactionEngine.ts  # Core reaction logic
│   │
│   ├── store/
│   │   └── labStore.ts        # Zustand state management
│   │
│   ├── types/
│   │   └── chemistry.ts       # TypeScript interfaces
│   │
│   ├── data/
│   │   ├── chemicals.json     # Chemical database
│   │   └── reactions.json     # Reaction database
│   │
│   └── utils/
│       ├── particleSystem.ts  # Particle effects engine
│       ├── localStorage.ts     # Browser storage utilities
│       └── chemistryHelpers.ts # Helper functions
│
├── package.json
├── tsconfig.json
└── README.md
```

## 🧬 How It Works

### 1. Reaction Engine
The `reactionEngine.ts` reads from two JSON databases:
- **chemicals.json**: Defines available chemicals with properties (formula, color, hazard level)
- **reactions.json**: Defines reaction rules (reactants, products, effects, conditions)

When you mix chemicals, the engine:
1. Collects all chemical IDs in the beaker
2. Searches for a matching reaction (order-independent)
3. Checks if conditions are met (heat, stir)
4. Returns the reaction data or null

### 2. Visual Effects System
The `BeakerCanvas` component uses HTML Canvas and `requestAnimationFrame`:
- **Liquid rendering**: Color blending with gradients
- **Particle system**: Bubble, precipitate, smoke, and explosion particles
- **Physics simulation**: Buoyancy, gravity, drag forces
- **Temperature display**: Visual thermometer

### 3. State Management
Uses Zustand for global state:
- Beaker state (chemicals, color, temperature, effects)
- Current reaction
- Experiment history

### 4. Drag & Drop
Uses `@dnd-kit` for:
- Draggable chemical bottles
- Droppable beaker zone
- Touch-friendly on mobile

## 🔬 Adding New Reactions

### Step 1: Add Chemical (if new)
Edit `src/data/chemicals.json`:

```json
{
  "id": "new-chemical",
  "name": "Chemical Name",
  "formula": "H₂O",
  "color": "#hex-color",
  "type": "acid|base|salt|metal|nonmetal|organic",
  "hazard": "safe|caution|warning|danger",
  "description": "Brief description"
}
```

### Step 2: Add Reaction
Edit `src/data/reactions.json`:

```json
{
  "id": "reaction-n",
  "reactants": ["chemical-id-1", "chemical-id-2"],
  "products": ["Product₁", "Product₂"],
  "type": "neutralization|precipitation|gas-evolution|color-change|redox|combustion",
  "equation": "A + B → C + D",
  "explanation": "Why this reaction occurs...",
  "safety": "Safety warnings...",
  "effects": {
    "color": "#resulting-color",
    "bubbles": "small|medium|large",
    "precipitate": {
      "color": "#precipitate-color",
      "amount": "light|moderate|heavy"
    },
    "gas": {
      "type": "CO₂",
      "intensity": 8
    },
    "smoke": true,
    "explosion": false,
    "glow": false,
    "temperatureChange": 5
  },
  "requiresHeat": false,
  "requiresStir": false
}
```

### Step 3: Test!
No code changes needed - the reaction engine will automatically detect the new reaction!

## 💻 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Drag & Drop**: @dnd-kit
- **Canvas**: HTML Canvas API + requestAnimationFrame
- **Storage**: Browser LocalStorage API

## 📦 Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The app is fully static and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🎓 Educational Use

This simulator is designed for:
- **Students**: Learn chemistry concepts visually
- **Teachers**: Demonstrate reactions safely in class
- **Enthusiasts**: Explore chemical behavior interactively

### Reaction Types Included:
- ⚖️ **Neutralization**: Acid-base reactions
- ⬇️ **Precipitation**: Insoluble solid formation
- 💨 **Gas Evolution**: Gaseous product release
- 🎨 **Color Change**: Complex ion formation
- ⚡ **Redox**: Electron transfer reactions
- 🔥 **Combustion**: Exothermic reactions (simulated safely)

## ⚠️ Safety Notice

**This is a SIMULATION ONLY!**

Some reactions shown here are **extremely dangerous** in real life and should **NEVER** be attempted without:
- Proper training
- Professional equipment
- Laboratory supervision
- Safety protocols

**This tool is for EDUCATIONAL PURPOSES ONLY.**

## 🤝 Contributing

Want to add more chemicals or reactions? Fork the repo and submit a PR!

Ideas for contributions:
- More reaction types
- Organic chemistry reactions
- Advanced visual effects
- Sound effects
- Mobile app version (React Native)

## 📝 License

MIT License - feel free to use for educational purposes!

## 🙏 Acknowledgments

- Chemical data inspired by real chemistry textbooks
- Visual design inspired by modern lab aesthetics
- Built with ❤️ for chemistry education

---

**Made with Next.js, TypeScript, and a passion for chemistry! ⚗️**
