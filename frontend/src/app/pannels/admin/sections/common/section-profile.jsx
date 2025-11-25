function SectionProfile({ company }) {
    if (!company) return null;

    return (
        <>
            <h4 className="section-head-small mb-4">Profile Info</h4>
            <div className="twm-s-info">
                <ul>
                    {company.team_size && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-users" />
                                <span className="twm-title">Team Size</span>
                                <div className="twm-s-info-discription">{company.team_size}</div>
                            </div>
                        </li>
                    )}
                    {company.established_since && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-calendar" />
                                <span className="twm-title">Established</span>
                                <div className="twm-s-info-discription">{company.established_since}</div>
                            </div>
                        </li>
                    )}
                    {company.location && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-map-marker-alt" />
                                <span className="twm-title">Location</span>
                                <div className="twm-s-info-discription">{company.location}</div>
                            </div>
                        </li>
                    )}
                    {company.phone && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-mobile-alt" />
                                <span className="twm-title">Phone</span>
                                <div className="twm-s-info-discription">{company.phone}</div>
                            </div>
                        </li>
                    )}
                    {company.email && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-at" />
                                <span className="twm-title">Email</span>
                                <div className="twm-s-info-discription">{company.email}</div>
                            </div>
                        </li>
                    )}
                    {company.website && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-globe" />
                                <span className="twm-title">Website</span>
                                <div className="twm-s-info-discription">
                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        </li>
                    )}
                    {company.address && (
                        <li>
                            <div className="twm-s-info-inner">
                                <i className="fas fa-map-marker-alt" />
                                <span className="twm-title">Address</span>
                                <div className="twm-s-info-discription">{company.address}</div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}

export default SectionProfile;
