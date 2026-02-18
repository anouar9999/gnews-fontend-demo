const statusStyles = {
  nouveau: 'bg-gray-100 text-gray-700',
  brouillon_ia: 'bg-yellow-100 text-yellow-700',
  en_revision: 'bg-blue-100 text-blue-700',
  publie: 'bg-green-100 text-green-700',
  archive: 'bg-red-100 text-red-700',
};

const statusLabels = {
  nouveau: 'New',
  brouillon_ia: 'AI Draft',
  en_revision: 'In Review',
  publie: 'Published',
  archive: 'Archived',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
      {statusLabels[status] || status}
    </span>
  );
}
