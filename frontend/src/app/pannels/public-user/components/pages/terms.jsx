import { useEffect, useState } from "react";

function TermsAndConditions() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/terms/active/")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error(err));
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>{data.title}</h2>
            <p><strong>Version:</strong> {data.version}</p>

            {data.sections.map((sec) => (
                <div key={sec.id} className="mb-4">
                    <h4>{sec.order}. {sec.title}</h4>

                    {sec.contents.map((c) => (
                        <div key={c.id}>
                            {c.content_type === "paragraph" && (
                                <p>{c.text}</p>
                            )}

                            {c.content_type === "subheading" && (
                                <h5>{c.text}</h5>
                            )}

                            {c.content_type === "bullet" && (
                                <ul>
                                    <li>{c.text}</li>
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TermsAndConditions;
