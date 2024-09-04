import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Pagination = ({ notesPerPage, totalNotes, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalNotes / notesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const pages = [];

  if (totalPages <= 5) {
    pages.push(...pageNumbers);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <nav className='flex justify-center'>
      <ul className="flex mt-4">
        <li className="mx-1">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            className="px-3 py-1 border rounded"
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon />
          </button>
        </li>
        {pages.map((number, index) => (
          <li key={index} className={`mx-1 ${currentPage === number ? 'font-bold' : ''}`}>
            {number === '...' ? (
              <span className="px-3 py-1 border rounded">{number}</span>
            ) : (
              <button
                onClick={() => paginate(number)}
                className="px-3 py-1 border rounded"
              >
                {number}
              </button>
            )}
          </li>
        ))}
        <li className="mx-1">
          <button
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-3 py-1 border rounded"
            disabled={currentPage === totalPages}
          >
            <ArrowRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;