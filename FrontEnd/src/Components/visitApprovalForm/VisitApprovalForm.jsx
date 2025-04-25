import React from 'react';
import './visitApproval.css';
import VisitApprovalForm from '../../Components/visitApprovalForm/VisitApprovalForm';

export default function VisitApprovalPage() {
    return (
        <div className="visit-approval-page">
            <div className="page-header">
                <h1>Visit Approvals</h1>
                <p>Review and manage visit requests</p>
            </div>
            <VisitApprovalForm />
        </div>
    );
} 