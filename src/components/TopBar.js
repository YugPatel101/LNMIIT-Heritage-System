export default function TopBar() {
  return (
    <div className="bg-gray-800 text-white text-xs py-2 px-6 flex justify-between items-center">
      <div>
        <span>Welcome to LNMIIT</span>
      </div>
      <div className="flex gap-4">
        <a href="#login" className="hover:underline">Login</a>
        {/* Add more links here */}
      </div>
    </div>
  );
}