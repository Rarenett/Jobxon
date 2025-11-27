import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";

function SectionPricingMonthly() {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/pricing-plans/")
            .then(res => res.json())
            .then(data => {
                // Filter only monthly plans
                const monthlyPlans = data.filter(
                    plan => plan.frequency.trim().toLowerCase() === "monthly"
                );
                // Sort by price ascending
                monthlyPlans.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                setPlans(monthlyPlans);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="pricing-block-outer">
            <div className="row justify-content-center">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`col-lg-4 col-md-6 m-b30 ${plan.recommended ? "p-table-highlight" : ""}`}
                    >
                        <div
                            className={`pricing-table-1 ${plan.recommended
                                    ? "circle-yellow"
                                    : index === 2
                                        ? "circle-pink"
                                        : ""
                                }`}
                        >
                            {plan.recommended && (
                                <div className="p-table-recommended">Recommended</div>
                            )}
                            <div className="p-table-title">
                                <h4 className="wt-title">{plan.name}</h4>
                            </div>
                            <div className="p-table-inner">
                                <div className="p-table-price">
                                    <span>${plan.price}/</span>
                                    <p>{plan.frequency}</p>
                                </div>
                                <div className="p-table-list">
                                    <ul>
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className={feature.available ? "" : "disable"}>
                                                <i
                                                    className={`feather-${feature.available ? "check" : "x"}`}
                                                />
                                                {feature.feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-table-btn">
                                    <NavLink to={publicUser.pages.ABOUT} className="site-button">
                                        Purchase Now
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SectionPricingMonthly;
