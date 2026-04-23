
export default function CountryMap({ mapColor }) {
  // NOTE:
  // `@react-jvectormap/core` is Webpack-bundled and throws in Vite at runtime
  // (css-loader runtime). This placeholder keeps the dashboard working.
  return (
    <div
      className="flex items-center justify-center w-full rounded-lg border border-gray-200 bg-white px-4 py-10 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
      style={{
        // Keeps existing "mapColor" prop meaningful.
        background:
          mapColor ? `linear-gradient(0deg, ${mapColor}26, ${mapColor}0D)` : "",
      }}
    >
      Map temporarily disabled (Vite incompatibility).
    </div>
  );
}

