import './skeleton.css';

interface SkeletonTableProps {
  columns: number;
  rows: number;
}

export const SkeletonTable = ({ columns, rows }: SkeletonTableProps) => {
  return (
    <table className="dashboard-card-table">
      <thead>
        <tr>
          {Array.from({ length: columns }, (_, index) => (
            <th key={`header-${index}`}>
              <div className="skeleton skeleton-cell" />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <td key={`cell-${rowIndex}-${columnIndex}`}>
                <div className="skeleton skeleton-cell" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
