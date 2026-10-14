export default function Footer({ fromCache, stats, onClear }) {
  return (
    <footer className="foot">
      <span>
        {fromCache === null
          ? ''
          : fromCache
            ? 'Last request: served from cache'
            : 'Last request: fetched from the network'}
      </span>
      <span>
        {stats.entries} cached {stats.entries === 1 ? 'entry' : 'entries'} ({stats.kb} KB)
      </span>
      <button type="button" onClick={onClear}>Clear cache</button>
    </footer>
  );
}
