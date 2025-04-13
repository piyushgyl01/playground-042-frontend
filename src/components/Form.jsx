import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

export default function Form({ isEdit }) {
  const [formData, setFormData] = useState({
    coverURL: "",
    title: "",
    description: "",
    author: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(
    `https://playground-042-backend.vercel.app/mangas/${id}`
  );

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        coverURL: data?.coverURL || "",
        title: data?.title || "",
        description: data?.description || "",
        author: data?.author || "",
      });
    }
  }, [isEdit, id, data]);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      if (isEdit) {
        const response = await fetch(
          `https://playground-042-backend.vercel.app/mangas/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate(`/details/${id}`);
          refetch();
        }
      } else {
        const response = await fetch(
          `https://playground-042-backend.vercel.app/mangas`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <h2 className="card-title p-4">
          {isEdit ? "Edit Manga Details" : "Add New Manga"}
        </h2>

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

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="coverURL" className="form-label">
              Cover URL
            </label>
            <input
              type="text"
              className="form-control"
              name="coverURL"
              id="coverURL"
              value={formData.coverURL}
              onChange={(e) =>
                setFormData({ ...formData, coverURL: e.target.value })
              }
              required
              placeholder="https://placehold.co/600x400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="One Piece"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="A world of pirates"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="form-label">
              Author
            </label>
            <input
              type="text"
              className="form-control"
              name="author"
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
              placeholder="Oda"
            />
          </div>

          <div className="d-flex gap-2">
            <Link
              to={isEdit ? `/details/${id}` : "/"}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading" : isEdit ? "Save Changes" : "Add Anime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
