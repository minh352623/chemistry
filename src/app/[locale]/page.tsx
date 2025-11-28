import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-7xl font-bold mb-6 drop-shadow-2xl">
              ⚗️ Chemistry Lab
            </h1>
            <p className="text-3xl mb-4 font-light">
              Interactive Reaction Simulator
            </p>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Mix chemicals, trigger reactions, and witness stunning visual effects
              in your own virtual chemistry laboratory!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-20 transition-all">
              <div className="text-5xl mb-3">🧪</div>
              <h3 className="text-xl font-semibold mb-2">12+ Chemicals</h3>
              <p className="text-sm opacity-90">
                Acids, bases, salts, and reactive metals
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-20 transition-all">
              <div className="text-5xl mb-3">💥</div>
              <h3 className="text-xl font-semibold mb-2">10+ Reactions</h3>
              <p className="text-sm opacity-90">
                Precipitation, neutralization, explosions
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-20 transition-all">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-xl font-semibold mb-2">Visual Effects</h3>
              <p className="text-sm opacity-90">
                Bubbles, color changes, smoke & more
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/lab"
            className="inline-block bg-white text-indigo-600 text-2xl font-bold px-12 py-6 rounded-full 
                     shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300
                     hover:bg-opacity-90"
          >
            🚀 Start Experiment
          </Link>

          {/* Additional Info */}
          <div className="mt-16 text-sm opacity-75">
            <p>
              Educational • Safe • Interactive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

