export default function SidebarMenu({ selectedTab, setSelectedTab }) {
  const items = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'My Bookings', value: 'bookings' },
  ];

  return (
    <nav className="space-y-2">
      {items.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setSelectedTab(value)}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            selectedTab === value
              ? 'bg-indigo-100 text-indigo-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
