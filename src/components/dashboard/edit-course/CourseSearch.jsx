export default function CourseSearch({ query, setQuery }) {
  return (
    <input
      className="search-input"
      placeholder="Search course by title..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}
