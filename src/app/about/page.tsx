export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ℹ️ About Chemistry Simulator
          </h1>
          <p className="text-xl text-gray-600">
            Learn how this interactive lab works
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* What is this */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              🧪 What is this?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Chemistry Reaction Simulator is an interactive web application that lets you
              experiment with chemical reactions in a safe, virtual environment. Mix acids, bases,
              salts, and other chemicals to observe realistic reactions including color changes,
              precipitation, gas evolution, and even safe simulations of dangerous reactions.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              ⚙️ How it works
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>1. Drag & Drop:</strong> Select chemicals from the shelf and drag them into the beaker.</p>
              <p><strong>2. Mix:</strong> Click the "Mix & React" button to trigger a reaction evaluation.</p>
              <p><strong>3. Conditions:</strong> Some reactions require heating or stirring - use the control buttons.</p>
              <p><strong>4. Observe:</strong> Watch the visual effects unfold - bubbles, color changes, precipitates, and more!</p>
              <p><strong>5. Learn:</strong> Read the reaction panel to understand what happened and why.</p>
            </div>
          </div>

          {/* Types of Reactions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              🔬 Types of Reactions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">⚖️ Neutralization</h3>
                <p className="text-sm text-gray-700">
                  Acids react with bases to form salt and water. Often exothermic.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">⬇️ Precipitation</h3>
                <p className="text-sm text-gray-700">
                  Formation of insoluble solid particles that settle at the bottom.
                </p>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-semibold text-cyan-800 mb-2">💨 Gas Evolution</h3>
                <p className="text-sm text-gray-700">
                  Reactions that produce gaseous products, visible as bubbles.
                </p>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-pink-800 mb-2">🎨 Color Change</h3>
                <p className="text-sm text-gray-700">
                  Formation of colored complex ions or products.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">⚡ Redox</h3>
                <p className="text-sm text-gray-700">
                  Electron transfer reactions between elements.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">🔥 Combustion</h3>
                <p className="text-sm text-gray-700">
                  Highly exothermic reactions, some explosive. Handle with care!
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              💻 Tech Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <strong>Frontend:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Next.js 15 (App Router)</li>
                  <li>React 19</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <strong>Libraries:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Zustand (State Management)</li>
                  <li>@dnd-kit (Drag & Drop)</li>
                  <li>HTML Canvas API (Visuals)</li>
                  <li>LocalStorage API (Persistence)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety Note */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ⚠️ Important Safety Note
            </h2>
            <p className="text-gray-800 leading-relaxed">
              This is a <strong>simulation only</strong>. Some reactions shown here are extremely 
              dangerous in real life and should <strong>never</strong> be attempted without proper 
              training, equipment, and supervision in a professional laboratory. This tool is for 
              <strong> educational purposes only</strong>.
            </p>
          </div>

          {/* Educational Value */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              📚 Educational Value
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This simulator helps students and chemistry enthusiasts:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Visualize chemical reactions in a safe environment</li>
              <li>Understand reaction types and mechanisms</li>
              <li>Learn chemical formulas and equations</li>
              <li>Explore cause-and-effect relationships</li>
              <li>Build intuition about chemical behavior</li>
            </ul>
          </div>

          {/* How to Extend */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              🚀 How to Add New Reactions
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Step 1:</strong> Add chemical to <code className="bg-gray-100 px-2 py-1 rounded">src/data/chemicals.json</code></p>
              <p><strong>Step 2:</strong> Add reaction to <code className="bg-gray-100 px-2 py-1 rounded">src/data/reactions.json</code></p>
              <p><strong>Step 3:</strong> Define visual effects (bubbles, color, precipitate, etc.)</p>
              <p><strong>Step 4:</strong> The reaction engine will automatically detect and execute it!</p>
              <p className="text-sm italic mt-4">
                The system is designed to be easily extensible. Just add data - no code changes needed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
