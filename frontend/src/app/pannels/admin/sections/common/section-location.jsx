function SectionLocation({ company }) {
    if (!company || !company.map_iframe) {
        return null; // Don't render if no map available
    }

    return (
        <>
            <h4 className="section-head-small mb-4">Location</h4>
            <div className="twm-s-map-iframe">
                <div dangerouslySetInnerHTML={{ __html: company.map_iframe }} />
            </div>
        </>
    );
}

export default SectionLocation;
