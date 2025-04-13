import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    "https://playground-042-backend.vercel.app/mangas"
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this manga?")) {
      try {
        const response = await fetch(
          `https://playground-042-backend.vercel.app/mangas/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            `Failed to delete: ${errorData.message || response.statusText}`
          );
        }
      } catch (error) {
        alert(`Error deleting manga: ${error.message}`);
        console.error(error);
      }
    }
  }

  return (
    <div>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manga List</h2>
          <Link className="btn btn-success" to="/post">
            Add New Manga
          </Link>
        </div>

        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {data && data.length === 0 && !loading && !error && (
          <div className="alert alert-info">
            No manga found. Add a new one to get started!
          </div>
        )}

        <div className="row">
          {data &&
            data.length > 0 &&
            data.map((manga) => (
              <div className="col-md-12 mb-4 list-group" key={manga._id}>
                <div className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">
                      {manga.title} by {manga.author}
                    </h5>
                    <small className="text-body-secondary">
                      {new Date(manga.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-1">{manga.description}</p>
                  <Link
                    to={`/details/${manga._id}`}
                    className="btn btn-primary me-2 mt-2"
                  >
                    View Details
                  </Link>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleDelete(manga._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
