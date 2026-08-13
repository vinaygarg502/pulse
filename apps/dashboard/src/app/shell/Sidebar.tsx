const navigation = ['Dashboard', 'Events', 'Metrics', 'Alerts', 'Settings'];
const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          {navigation.map((item) => (
            <li key={item}>
              <a href="#">{item}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
