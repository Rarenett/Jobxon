function SectionOfficeVideo1Admin({ company }) {
    if (!company) return null;

    const hasVideos = company.video || 
                     (company.youtube_links && company.youtube_links.length > 0) || 
                     (company.vimeo_links && company.vimeo_links.length > 0);

    if (!hasVideos) return null;

    return (
        <>
            <h4 className="twm-s-title">Company Videos</h4>
            
            {/* Main video */}
            {company.video && (
                <div className="video-section-first mb-4">
                    <a href={company.video} className="mfp-video play-now-video">
                        <i className="icon feather-play" />
                        <span className="ripple" />
                    </a>
                </div>
            )}

            {/* YouTube Links */}
            {company.youtube_links && company.youtube_links.length > 0 && (
                <div className="mb-4">
                    <h5>YouTube Videos</h5>
                    <div className="row">
                        {company.youtube_links.map((link, index) => (
                            <div className="col-md-6 mb-3" key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-block">
                                    <i className="fab fa-youtube" /> Video {index + 1}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Vimeo Links */}
            {company.vimeo_links && company.vimeo_links.length > 0 && (
                <div className="mb-4">
                    <h5>Vimeo Videos</h5>
                    <div className="row">
                        {company.vimeo_links.map((link, index) => (
                            <div className="col-md-6 mb-3" key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-block">
                                    <i className="fab fa-vimeo" /> Video {index + 1}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default SectionOfficeVideo1Admin;
