module.exports = [
"[project]/src/app/components/Hosts/HostCompanyForm.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HostCompanyForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
;
;
;
function HostCompanyForm({ company, agreements, onSubmit, onCancel }) {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        agreementId: company?.agreementId || '',
        companyName: company?.companyName || '',
        registrationNumber: company?.registrationNumber || '',
        address: company?.address || '',
        contactPerson: company?.contactPerson || '',
        contactEmail: company?.contactEmail || '',
        contactPhone: company?.contactPhone || '',
        industrySector: company?.industrySector || '',
        learnerCapacity: company?.learnerCapacity || '',
        confirmationLetter: company?.confirmationLetter || false,
        mouStatus: company?.mouStatus || 'Not Applicable',
        notes: company?.notes || ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [apiError, setApiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const industrySectors = [
        'Manufacturing',
        'Information Technology',
        'Engineering',
        'Healthcare',
        'Finance',
        'Retail',
        'Construction',
        'Education',
        'Hospitality',
        'Other'
    ];
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.agreementId) newErrors.agreementId = 'SETA Agreement is required';
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Email is invalid';
        }
        if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
        if (!formData.industrySector) newErrors.industrySector = 'Industry sector is required';
        if (!formData.learnerCapacity || formData.learnerCapacity < 1) {
            newErrors.learnerCapacity = 'Learner capacity must be at least 1';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    //UPDATED: API + existing onSubmit support
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        setApiError("");
        const payload = {
            administrator_id: sessionStorage.getItem("admin_id"),
            agreement_id: formData.agreementId,
            company_name: formData.companyName.trim(),
            registration_number: formData.registrationNumber.trim(),
            address: formData.address.trim(),
            contact_person: formData.contactPerson.trim(),
            company_email: formData.contactEmail.trim(),
            company_phone: formData.contactPhone.trim(),
            industry: formData.industrySector,
            capacity_of_required_learners: Number(formData.learnerCapacity),
            confirmation: formData.confirmationLetter,
            notes: formData.notes?.trim() || "",
            status: formData.mouStatus
        };
        try {
            const url = company ? `https://seta-api-3g5xl.ondigitalocean.app/api/administrators/editHostCompany/${company.company_id}` : `https://seta-api-3g5xl.ondigitalocean.app/api/administrators/addHostCompany`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                data = await response.json();
            } else {
                throw new Error(await response.text());
            }
            if (!response.ok) throw new Error(data?.message || data?.error || "Request failed");
            onSubmit?.(data);
        } catch (err) {
            setApiError(err.message);
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleChange = (e)=>{
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        if (errors[name]) {
            setErrors((prev)=>({
                    ...prev,
                    [name]: ''
                }));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [
            apiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm p-3 rounded bg-red-50 border border-red-200 text-red-700",
                children: apiError
            }, void 0, false, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 130,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                        },
                        children: "Company Information"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "SETA Agreement *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 142,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "agreementId",
                                        value: formData.agreementId,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.agreementId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select SETA Agreement..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            agreements.filter((agreement)=>agreement.status === 'Active').map((agreement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: agreement.agreement_id,
                                                    children: [
                                                        agreement.name,
                                                        " - ",
                                                        agreement.reference_number
                                                    ]
                                                }, agreement.agreement_id, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                    lineNumber: 156,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    errors.agreementId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.agreementId
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: "Only learners allocated to this SETA can be placed at this company"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Company Name *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        name: "companyName",
                                        value: formData.companyName,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.companyName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "Enter company name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 173,
                                        columnNumber: 13
                                    }, this),
                                    errors.companyName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.companyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Registration Number *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        name: "registrationNumber",
                                        value: formData.registrationNumber,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.registrationNumber ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "e.g., 2021/123456/07"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this),
                                    errors.registrationNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.registrationNumber
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Address *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        name: "address",
                                        value: formData.address,
                                        onChange: handleChange,
                                        rows: "3",
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.address ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "Enter company address"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this),
                                    errors.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.address
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Industry Sector *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "industrySector",
                                        value: formData.industrySector,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.industrySector ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select industry sector..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 234,
                                                columnNumber: 15
                                            }, this),
                                            industrySectors.map((sector)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: sector,
                                                    children: sector
                                                }, sector, false, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    errors.industrySector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.industrySector
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Learner Capacity *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "learnerCapacity",
                                        value: formData.learnerCapacity,
                                        onChange: handleChange,
                                        min: "1",
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.learnerCapacity ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "Number of learners"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this),
                                    errors.learnerCapacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.learnerCapacity
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                        },
                        children: "Contact Information"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Contact Person *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        name: "contactPerson",
                                        value: formData.contactPerson,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.contactPerson ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "Full name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this),
                                    errors.contactPerson && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.contactPerson
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Email *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        name: "contactEmail",
                                        value: formData.contactEmail,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.contactEmail ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "email@company.com"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, this),
                                    errors.contactEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.contactEmail
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Phone *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 308,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        name: "contactPhone",
                                        value: formData.contactPhone,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: errors.contactPhone ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        placeholder: "+27 12 345 6789"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    errors.contactPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                        },
                                        children: errors.contactPhone
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                        },
                        children: "Documentation"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "confirmationLetter",
                                        checked: formData.confirmationLetter,
                                        onChange: handleChange,
                                        className: "w-4 h-4 rounded",
                                        style: {
                                            accentColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm font-medium",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "Company Confirmation Letter Received"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: "MoU Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 348,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "mouStatus",
                                        value: formData.mouStatus,
                                        onChange: handleChange,
                                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                        style: {
                                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Not Applicable",
                                                children: "Not Applicable"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 358,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Pending",
                                                children: "Pending"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 359,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Signed",
                                                children: "Signed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 360,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Expired",
                                                children: "Expired"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                                lineNumber: 361,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-2",
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                        },
                        children: "Additional Notes"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        name: "notes",
                        value: formData.notes,
                        onChange: handleChange,
                        rows: "4",
                        className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                        style: {
                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                        },
                        placeholder: "Add any additional information..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onCancel,
                        className: "flex-1 px-6 py-3 rounded-lg border hover:bg-gray-50 font-medium",
                        style: {
                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                        },
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isSubmitting,
                        className: "flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50",
                        style: {
                            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success
                        },
                        children: isSubmitting ? 'Saving...' : company ? 'Update Company' : 'Create Company'
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
                lineNumber: 384,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Hosts/HostCompanyForm.jsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/components/Hosts/LearnerPlacement.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LearnerPlacementForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const normalizeId = (id)=>String(id).toLowerCase();
function LearnerPlacementForm({ placement = null, companyId, availableLearners = [], studentInfo = [], onSubmit, onCancel }) {
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    /* ---------------- SELECTED LEARNERS (NORMALIZED) ---------------- */ const [selectedLearners, setSelectedLearners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(placement ? [
        placement.student_id ?? placement.learnerId ?? placement.studentId
    ] : []);
    /* ---------------- FORM DATA ---------------- */ const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        startDate: placement?.startDate || '',
        endDate: placement?.endDate || '',
        supervisorName: placement?.supervisorName || '',
        supervisorEmail: placement?.supervisorEmail || '',
        supervisorPhone: placement?.supervisorPhone || '',
        status: placement?.status || 'Active',
        notes: placement?.notes || ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    /* ---------------- STUDENT LOOKUP ---------------- */ const studentMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = studentInfo.reduce((acc, s)=>{
            const key = normalizeId(s.id); // Normalize key here
            acc[key] = s;
            return acc;
        }, {});
        console.log('STUDENT MAP:', map);
        return map;
    }, [
        studentInfo
    ]);
    /* ---------------- ENRICH + DEDUPE ALLOCATIONS ---------------- */ const enrichedLearners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        console.log("===== ENRICHMENT START =====");
        console.log("availableLearners:", availableLearners);
        console.log("studentMap:", studentMap);
        console.log("studentMap keys:", Object.keys(studentMap));
        const seen = new Set();
        const result = availableLearners.map((allocation, index)=>{
            console.log(`\n--- Allocation [${index}] ---`);
            console.log("allocation raw:", allocation);
            const studentId = allocation.student_id ?? allocation.studentId ?? allocation.learner_id;
            console.log("resolved studentId (raw):", studentId);
            if (!studentId) {
                console.warn("No studentId on allocation");
                return null;
            }
            const normalizedId = normalizeId(studentId);
            console.log("normalized studentId:", normalizedId);
            const student = studentMap[normalizedId];
            console.log("student lookup result:", student);
            if (!student) {
                console.warn("Missing studentInfo for allocation:", {
                    allocation,
                    normalizedId,
                    studentMapKeys: Object.keys(studentMap)
                });
                return null;
            }
            if (seen.has(student.id)) {
                console.warn("Duplicate student skipped:", student.id);
                return null;
            }
            seen.add(student.id);
            console.log("Student accepted:", student);
            return {
                studentId: student.id,
                firstName: student.first_name ?? '',
                lastName: student.last_name ?? '',
                email: student.email ?? '',
                phone: student.phone ?? '',
                programme: student.programme ?? '',
                faculty: student.faculty ?? '',
                setaProgrammeId: allocation.programme_id,
                fundingWindowId: allocation.funding_window_id
            };
        }).filter(Boolean);
        console.log("===== ENRICHMENT END =====");
        console.log("ENRICHED LEARNERS RESULT:", result);
        return result;
    }, [
        availableLearners,
        studentMap
    ]);
    /* ---------------- FILTER ---------------- */ const filteredLearners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchTerm) return enrichedLearners;
        const search = searchTerm.toLowerCase();
        const result = enrichedLearners.filter((l)=>{
            const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
            const studentId = String(l.studentId).toLowerCase();
            const programme = l.programme?.toLowerCase() || '';
            return fullName.includes(search) || studentId.includes(search) || programme.includes(search);
        });
        console.log('FILTERED LEARNERS:', result);
        return result;
    }, [
        enrichedLearners,
        searchTerm
    ]);
    /* ---------------- HANDLERS ---------------- */ const handleChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
        if (errors[field]) {
            setErrors((prev)=>({
                    ...prev,
                    [field]: ''
                }));
        }
    };
    const handleToggleLearner = (studentId)=>{
        if (placement) return;
        setSelectedLearners((prev)=>prev.includes(studentId) ? prev.filter((id)=>id !== studentId) : [
                ...prev,
                studentId
            ]);
        if (errors.learners) {
            setErrors((prev)=>({
                    ...prev,
                    learners: ''
                }));
        }
    };
    const handleSelectAll = ()=>{
        if (placement) return;
        if (selectedLearners.length === filteredLearners.length) {
            setSelectedLearners([]);
        } else {
            setSelectedLearners(filteredLearners.map((l)=>l.studentId).filter(Boolean));
        }
    };
    /* ---------------- VALIDATION ---------------- */ const validate = ()=>{
        const newErrors = {};
        if (!placement && selectedLearners.length === 0) {
            newErrors.learners = 'Please select at least one learner';
        }
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';
        if (!formData.supervisorEmail) newErrors.supervisorEmail = 'Supervisor email is required';
        if (!formData.supervisorPhone) newErrors.supervisorPhone = 'Supervisor phone is required';
        if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /* ---------------- SUBMIT ---------------- */ const handleSubmit = async ()=>{
        if (!validate()) return;
        const adminId = sessionStorage.getItem('admin_id');
        if (!adminId) {
            setErrors({
                api: 'Administrator session expired. Please log in again.'
            });
            return;
        }
        if (!companyId) {
            setErrors({
                api: 'Please select a valid company before placing learners.'
            });
            return;
        }
        if (!selectedLearners || selectedLearners.length === 0) {
            setErrors({
                api: 'No learners selected for placement.'
            });
            return;
        }
        setLoading(true);
        setErrors({});
        setSuccessMessage('');
        // Ensure we submit only valid learners
        const learnersToSubmit = placement ? [
            selectedLearners[0]
        ] : selectedLearners;
        const failed = [];
        const success = [];
        try {
            console.log('Submitting learners with companyId:', companyId);
            console.log('Learners to submit:', learnersToSubmit);
            for (const student_id of learnersToSubmit){
                if (!student_id) {
                    failed.push('Invalid student ID.');
                    continue;
                }
                try {
                    const res = await fetch('https://seta-api-3g5xl.ondigitalocean.app/api/administrators/placeLearner', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            administrator_id: adminId,
                            student_id,
                            company_id: companyId,
                            start_date: formData.startDate || null,
                            end_date: formData.endDate || null,
                            supervisor: formData.supervisorName || '',
                            supervisor_email: formData.supervisorEmail || '',
                            supervisor_phone: formData.supervisorPhone || '',
                            status: formData.status || 'Pending',
                            comments: formData.notes || ''
                        })
                    });
                    if (!res.ok) {
                        const contentType = res.headers.get('content-type');
                        const errorBody = contentType?.includes('application/json') ? JSON.stringify(await res.json(), null, 2) : await res.text();
                        failed.push(`Student ${student_id}: HTTP ${res.status} - ${errorBody}`);
                    } else {
                        success.push(student_id);
                    }
                    // Small delay to avoid hitting rate limit
                    await new Promise((r)=>setTimeout(r, 300));
                } catch (innerErr) {
                    failed.push(`Student ${student_id}: ${innerErr.message || 'Unexpected error'}`);
                }
            }
            if (failed.length > 0) {
                setErrors({
                    api: failed.join(' | ')
                });
            }
            if (success.length > 0) {
                setSuccessMessage(`Successfully placed ${success.length} learner(s)`);
            }
        } catch (err) {
            setErrors({
                api: err.message || 'Unexpected error occurred'
            });
        } finally{
            setLoading(false);
        }
    };
    const allSelected = filteredLearners.length > 0 && selectedLearners.length === filteredLearners.length;
    /* ---------------- UI ---------------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col md:flex-row gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold",
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                },
                                children: [
                                    "Select Learners ",
                                    !placement && '*'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 314,
                                columnNumber: 9
                            }, this),
                            !placement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleSelectAll,
                                className: "text-sm font-medium",
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                },
                                children: allSelected ? 'Deselect All' : 'Select All'
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 313,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 330,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                placeholder: "Search learners...",
                                className: "w-full pl-9 pr-4 py-2 border rounded-lg"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 331,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 329,
                        columnNumber: 7
                    }, this),
                    enrichedLearners.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 rounded-lg p-6 text-center bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-1",
                                children: "No learners available for placement"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: "Learners must be allocated to the same SETA before placement."
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 border rounded-lg overflow-y-auto max-h-[300px]",
                        children: filteredLearners.map((l)=>{
                            const selected = selectedLearners.includes(l.studentId);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>handleToggleLearner(l.studentId),
                                className: `flex items-center justify-between p-3 cursor-pointer ${selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold",
                                                children: [
                                                    l.firstName,
                                                    " ",
                                                    l.lastName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                                lineNumber: 359,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600",
                                                children: [
                                                    l.studentId,
                                                    " • ",
                                                    l.programme || 'No programme'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                                lineNumber: 360,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: selected,
                                        readOnly: true,
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                        lineNumber: 364,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, l.studentId, true, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 351,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                lineNumber: 312,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: formData.startDate,
                                onChange: (e)=>handleChange('startDate', e.target.value),
                                className: "border rounded-lg px-3 py-2",
                                placeholder: "Start Date"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 380,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: formData.endDate,
                                onChange: (e)=>handleChange('endDate', e.target.value),
                                className: "border rounded-lg px-3 py-2",
                                placeholder: "End Date"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 387,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 379,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Supervisor Name",
                        value: formData.supervisorName,
                        onChange: (e)=>handleChange('supervisorName', e.target.value),
                        className: "border rounded-lg px-3 py-2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 396,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "email",
                        placeholder: "Supervisor Email",
                        value: formData.supervisorEmail,
                        onChange: (e)=>handleChange('supervisorEmail', e.target.value),
                        className: "border rounded-lg px-3 py-2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 403,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        placeholder: "Supervisor Phone",
                        value: formData.supervisorPhone,
                        onChange: (e)=>handleChange('supervisorPhone', e.target.value),
                        className: "border rounded-lg px-3 py-2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 410,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: formData.status,
                        onChange: (e)=>handleChange('status', e.target.value),
                        className: "border rounded-lg px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "Active",
                                children: "Active"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 423,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "Completed",
                                children: "Completed"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 424,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "On Hold",
                                children: "On Hold"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 425,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "Terminated",
                                children: "Terminated"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 426,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 418,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        placeholder: "Notes",
                        value: formData.notes,
                        onChange: (e)=>handleChange('notes', e.target.value),
                        className: "border rounded-lg px-3 py-2 h-24 resize-none"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 429,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 438,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSubmit,
                                disabled: loading,
                                className: "flex-1 rounded-lg px-4 py-2 text-white disabled:opacity-60",
                                style: {
                                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success
                                },
                                children: loading ? 'Placing...' : placement ? 'Update Placement' : `Place ${selectedLearners.length} Learner(s)`
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                                lineNumber: 444,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                        lineNumber: 437,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
                lineNumber: 378,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Hosts/LearnerPlacement.jsx",
        lineNumber: 309,
        columnNumber: 3
    }, this);
}
}),
"[project]/src/app/components/ToastNotifications.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const Toast = ({ message, type, onClose })=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(onClose, 3000);
        return ()=>clearTimeout(timer);
    }, [
        onClose
    ]);
    const bgColor = type === 'success' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success : type === 'error' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].info;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 animate-slide-in",
        style: {
            backgroundColor: bgColor
        },
        children: [
            type === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/src/app/components/ToastNotifications.jsx",
                lineNumber: 20,
                columnNumber: 30
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/src/app/components/ToastNotifications.jsx",
                lineNumber: 21,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/src/app/components/ToastNotifications.jsx",
                lineNumber: 22,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/app/components/ToastNotifications.jsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "ml-4 hover:opacity-75",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ToastNotifications.jsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/components/ToastNotifications.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/ToastNotifications.jsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Toast;
}),
"[project]/src/app/components/ConfirmDialogue.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const ConfirmDialog = ({ title, message, onConfirm, onCancel })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-bold mb-2",
                    style: {
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                    },
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 mb-6",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "flex-1 px-4 py-2 rounded-lg border font-medium hover:bg-gray-50",
                            style: {
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                            },
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            className: "flex-1 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                            },
                            children: "Delete"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
            lineNumber: 8,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/components/ConfirmDialogue.jsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ConfirmDialog;
}),
"[project]/src/app/components/Hosts/Table.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlacementStats",
    ()=>PlacementStats,
    "default",
    ()=>PlacementTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function PlacementTable({ placements = [], allocatedLearners = [], companies = [], students = [], onEdit, onDelete, onView }) {
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterCompany, setFilterCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('asc');
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const itemsPerPage = 10;
    const enrichedPlacements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return placements.map((placement)=>{
            const learner = students.find((s)=>s.id === placement.student_id);
            const company = companies.find((c)=>c.company_id === placement.company_id || c.id === placement.company_id);
            return {
                ...placement,
                // normalize fields WITHOUT breaking existing usage
                learner,
                company,
                // keep camelCase aliases your UI already uses
                learnerId: placement.student_id,
                companyId: placement.company_id,
                startDate: placement.start_date,
                endDate: placement.end_date
            };
        });
    }, [
        placements,
        students,
        companies
    ]);
    const filteredPlacements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return enrichedPlacements.filter((item)=>{
            const { learner, company } = item;
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                const learnerName = learner ? `${learner.first_name ?? learner.firstName} ${learner.last_name ?? learner.lastName}`.toLowerCase() : '';
                const studentId = learner?.student_number?.toLowerCase() || learner?.studentId?.toLowerCase() || '';
                const companyName = company?.company_name?.toLowerCase() || '';
                if (!learnerName.includes(search) && !studentId.includes(search) && !companyName.includes(search)) {
                    return false;
                }
            }
            if (filterStatus && item.status !== filterStatus) return false;
            if (filterCompany && item.company_id !== filterCompany) return false;
            return true;
        });
    }, [
        enrichedPlacements,
        searchTerm,
        filterStatus,
        filterCompany
    ]);
    const sortedPlacements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!sortField) return filteredPlacements;
        return [
            ...filteredPlacements
        ].sort((a, b)=>{
            let aVal, bVal;
            switch(sortField){
                case 'learner':
                    aVal = a.learner ? `${a.learner.first_name ?? a.learner.firstName} ${a.learner.last_name ?? a.learner.lastName}` : '';
                    bVal = b.learner ? `${b.learner.first_name ?? b.learner.firstName} ${b.learner.last_name ?? b.learner.lastName}` : '';
                    break;
                case 'company':
                    aVal = a.company?.company_name || a.company?.companyName || '';
                    bVal = b.company?.company_name || b.company?.companyName || '';
                    break;
                case 'startDate':
                    aVal = new Date(a.start_date ?? a.startDate);
                    bVal = new Date(b.start_date ?? b.startDate);
                    break;
                case 'endDate':
                    aVal = new Date(a.end_date ?? a.endDate);
                    bVal = new Date(b.end_date ?? b.endDate);
                    break;
                default:
                    return 0;
            }
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [
        filteredPlacements,
        sortField,
        sortDirection
    ]);
    const totalPages = Math.ceil(sortedPlacements.length / itemsPerPage);
    const paginatedPlacements = sortedPlacements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handleSort = (field)=>{
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const SortIcon = ({ field })=>{
        if (sortField !== field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-4 h-4 text-gray-400"
        }, void 0, false, {
            fileName: "[project]/src/app/components/Hosts/Table.jsx",
            lineNumber: 135,
            columnNumber: 37
        }, this);
        return sortDirection === 'asc' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "w-4 h-4",
            style: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
            }
        }, void 0, false, {
            fileName: "[project]/src/app/components/Hosts/Table.jsx",
            lineNumber: 137,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-4 h-4",
            style: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
            }
        }, void 0, false, {
            fileName: "[project]/src/app/components/Hosts/Table.jsx",
            lineNumber: 138,
            columnNumber: 7
        }, this);
    };
    const getStatusBadge = (status)=>{
        const styles = {
            'Active': 'bg-green-100 text-green-800',
            'Completed': 'bg-blue-100 text-blue-800',
            'On Hold': 'bg-yellow-100 text-yellow-800',
            'Terminated': 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search by learner name, student ID, or company...",
                                            value: searchTerm,
                                            onChange: (e)=>{
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            },
                                            className: "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                            style: {
                                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: filterStatus,
                                    onChange: (e)=>{
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    },
                                    className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                    style: {
                                        borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "All Statuses"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Active",
                                            children: "Active"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Completed",
                                            children: "Completed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "On Hold",
                                            children: "On Hold"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 186,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Terminated",
                                            children: "Terminated"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 187,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: filterCompany,
                                    onChange: (e)=>{
                                        setFilterCompany(e.target.value);
                                        setCurrentPage(1);
                                    },
                                    className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                    style: {
                                        borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "All Companies"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 201,
                                            columnNumber: 15
                                        }, this),
                                        companies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: company.company_id,
                                                children: company.company_name || company.companyName
                                            }, company.company_id, false, {
                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    (searchTerm || filterStatus || filterCompany) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: [
                                    "Showing ",
                                    sortedPlacements.length,
                                    " of ",
                                    placements.length,
                                    " placements"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSearchTerm('');
                                    setFilterStatus('');
                                    setFilterCompany('');
                                    setCurrentPage(1);
                                },
                                className: "text-sm px-4 py-2 rounded-lg hover:bg-gray-100",
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                },
                                children: "Clear Filters"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg shadow-sm border overflow-hidden",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: paginatedPlacements.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        style: {
                                            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgLight
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                    onClick: ()=>handleSort('learner'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Learner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 245,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 244,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 240,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                    onClick: ()=>handleSort('company'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Company"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 253,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 252,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 248,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                    onClick: ()=>handleSort('startDate'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Start Date"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                lineNumber: 261,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                field: "startDate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                lineNumber: 262,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 260,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                    onClick: ()=>handleSort('endDate'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "End Date"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                lineNumber: 270,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                field: "endDate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                lineNumber: 271,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 269,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 265,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                    onClick: ()=>handleSort('status'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 279,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 278,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y",
                                        style: {
                                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                        },
                                        children: paginatedPlacements.map((item)=>{
                                            const { learner, company } = item;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-gray-50 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-2 rounded-lg",
                                                                    style: {
                                                                        backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgLight
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                        className: "w-5 h-5",
                                                                        style: {
                                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                        lineNumber: 293,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 292,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-semibold",
                                                                            style: {
                                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                            },
                                                                            children: learner ? `${learner.first_name} ${learner.last_name}` : 'Unknown'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                            lineNumber: 296,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-600",
                                                                            children: learner?.id || 'N/A'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                            lineNumber: 299,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 295,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 291,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 290,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                                    className: "w-4 h-4 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 307,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium",
                                                                            style: {
                                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                            },
                                                                            children: company?.company_name || 'Unknown'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                            lineNumber: 309,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: company?.industry || 'N/A'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                            lineNumber: 312,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 308,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 306,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 305,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: "w-4 h-4 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 320,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(item.startDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 319,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 318,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: "w-4 h-4 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 326,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(item.endDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                                    lineNumber: 327,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 325,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 324,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`,
                                                            children: item.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                            lineNumber: 331,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                        lineNumber: 330,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                lineNumber: 289,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                        lineNumber: 284,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                lineNumber: 237,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this),
                        totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 border-t flex items-center justify-between",
                            style: {
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600",
                                    children: [
                                        "Showing ",
                                        (currentPage - 1) * itemsPerPage + 1,
                                        " to ",
                                        Math.min(currentPage * itemsPerPage, sortedPlacements.length),
                                        " of ",
                                        sortedPlacements.length,
                                        " placements"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                    lineNumber: 345,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage(currentPage - 1),
                                            disabled: currentPage === 1,
                                            className: "px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
                                            style: {
                                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border,
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                            },
                                            children: "Previous"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 349,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: [
                                                ...Array(totalPages)
                                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCurrentPage(i + 1),
                                                    className: `px-4 py-2 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'text-white' : 'hover:bg-gray-50'}`,
                                                    style: {
                                                        backgroundColor: currentPage === i + 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary : 'transparent',
                                                        color: currentPage === i + 1 ? 'white' : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                                    },
                                                    children: i + 1
                                                }, i + 1, false, {
                                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                                    lineNumber: 359,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage(currentPage + 1),
                                            disabled: currentPage === totalPages,
                                            className: "px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
                                            style: {
                                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border,
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                            },
                                            children: "Next"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                            lineNumber: 376,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                                    lineNumber: 348,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                            lineNumber: 344,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "w-16 h-16 mx-auto mb-4 text-gray-300"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                            lineNumber: 390,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold mb-2",
                            style: {
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                            },
                            children: "No placements found"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                            lineNumber: 391,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: searchTerm || filterStatus || filterCompany ? 'Try adjusting your filters' : 'Placements will appear here once learners are placed at companies'
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/Table.jsx",
                            lineNumber: 394,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/Hosts/Table.jsx",
                    lineNumber: 389,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Hosts/Table.jsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
function PlacementStats({ placements }) {
    const stats = {
        total: placements.length,
        active: placements.filter((p)=>p.status === 'Active').length,
        completed: placements.filter((p)=>p.status === 'Completed').length,
        onHold: placements.filter((p)=>p.status === 'On Hold').length,
        terminated: placements.filter((p)=>p.status === 'Terminated').length
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4 shadow-sm border",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mb-1",
                        children: "Total"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold",
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                        },
                        children: stats.total
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 417,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4 shadow-sm border",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mb-1",
                        children: "Active"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 423,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold text-green-600",
                        children: stats.active
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4 shadow-sm border",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mb-1",
                        children: "Completed"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 428,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold text-blue-600",
                        children: stats.completed
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 429,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 427,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4 shadow-sm border",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mb-1",
                        children: "On Hold"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold text-yellow-600",
                        children: stats.onHold
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 432,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg p-4 shadow-sm border",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mb-1",
                        children: "Terminated"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 438,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold text-red-600",
                        children: stats.terminated
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/Table.jsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Hosts/Table.jsx",
                lineNumber: 437,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Hosts/Table.jsx",
        lineNumber: 416,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/components/Hosts/HostCompanyManagement.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HostCompanyManagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/helpers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$HostCompanyForm$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Hosts/HostCompanyForm.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$LearnerPlacement$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Hosts/LearnerPlacement.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ToastNotifications$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ToastNotifications.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ConfirmDialogue$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ConfirmDialogue.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$Table$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Hosts/Table.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function HostCompanyManagement({ allStudents = [] }) {
    const [companies, setCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [placements, setPlacements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allocatedLearners, setAllocatedLearners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [aStudents, setAllStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [agreements, setAgreements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterSector, setFilterSector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterSETA, setFilterSETA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalType, setModalType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmDialog, setConfirmDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expandedCompanies, setExpandedCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('companies');
    const activePlacementsByCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!placements?.length) return {};
        return placements.reduce((acc, p)=>{
            if (p.status === 'Active') {
                acc[p.company_id] = (acc[p.company_id] || 0) + 1;
            }
            return acc;
        }, {});
    }, [
        placements
    ]);
    //locl storage load and save
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadData();
        fetchCompanies();
        fetchAgreements();
        fetchAllocatedLearners();
        fetchAllStudents();
        fetchPlacements();
    }, []);
    const fetchCompanies = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://seta-api-3g5xl.ondigitalocean.app/api/administrators/host-companies', {
                withCredentials: true
            });
            if (res.status === 200 && res.data?.companies) {
                setCompanies(res.data.companies);
                // Optional: Save to localStorage for offline use
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                // Optionally show a success toast
                setToast({
                    type: 'success',
                    message: 'Host companies loaded successfully'
                });
            } else {
                console.warn('Unexpected API response', res);
            }
        } catch (err) {
            console.error('Failed to load host companies:', err);
            setToast({
                type: 'error',
                message: 'Failed to load host companies'
            });
        }
    };
    const fetchAgreements = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://seta-api-3g5xl.ondigitalocean.app/api/administrators/setaAgreements', {
                withCredentials: true
            });
            if (res.status === 200 && Array.isArray(res.data)) {
                setAgreements(res.data);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                setToast({
                    type: 'success',
                    message: 'SETA agreements loaded successfully'
                });
            } else {
                console.warn('Unexpected agreements response:', res.data);
            }
        } catch (err) {
            console.error('Failed to load SETA Agreements:', err);
            setToast({
                type: 'error',
                message: 'Failed to load SETA Agreements'
            });
        }
    };
    const fetchAllocatedLearners = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://seta-api-3g5xl.ondigitalocean.app/api/administrators/learner-allocations', {
                withCredentials: true
            });
            if (res.status === 200 && Array.isArray(res.data.allocations)) {
                setAllocatedLearners(res.data.allocations);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                setToast({
                    type: 'success',
                    message: 'Allocated learners loaded successfully'
                });
            } else {
                console.warn('Unexpected allocated learners response:', res.data);
            }
        } catch (err) {
            console.error('Failed to load Allocated Learners:', err);
            setToast({
                type: 'error',
                message: 'Failed to load Allocated Learners'
            });
        }
    };
    const fetchAllStudents = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/students', {
                withCredentials: true
            });
            if (res.status === 200 && Array.isArray(res.data.students)) {
                setAllStudents(res.data.students);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                setToast({
                    type: 'success',
                    message: 'Students loaded successfully'
                });
            } else {
                console.warn('Unexpected Students response:', res.data);
            }
        } catch (err) {
            console.error('Failed to load Students:', err);
            setToast({
                type: 'error',
                message: 'Failed to load Students'
            });
        }
    };
    const fetchPlacements = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://seta-api-3g5xl.ondigitalocean.app/api/administrators/learner-placements', {
                withCredentials: true
            });
            if (res.status === 200 && Array.isArray(res.data.placements)) {
                setPlacements(res.data.placements);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                setToast({
                    type: 'success',
                    message: 'Student Placements loaded successfully'
                });
            } else {
                console.warn('Unexpected Placements response:', res.data);
            }
        } catch (err) {
            console.error('Failed to load Placements:', err);
            setToast({
                type: 'error',
                message: 'Failed to load Placements'
            });
        }
    };
    const loadData = ()=>{
        try {
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const companiesData = undefined;
            const placementsData = undefined;
            const learnersData = undefined;
            const agreementsData = undefined;
            const studentData = undefined;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };
    const saveCompanies = (data)=>{
        try {
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
        } catch (error) {
            console.error('Error saving companies:', error);
        }
    };
    const savePlacements = (data)=>{
        try {
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
        } catch (error) {
            console.error('Error saving placements:', error);
        }
    };
    const showToast = (message, type = 'success')=>{
        setToast({
            message,
            type
        });
    };
    const openModal = (type, item = null)=>{
        setModalType(type);
        setSelectedItem(item);
        setShowModal(true);
    };
    const closeModal = ()=>{
        setShowModal(false);
        setSelectedItem(null);
        setModalType('');
    };
    // Company handlers
    const handleCreateCompany = (data)=>{
        const newCompany = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
            ...data,
            createdAt: new Date().toISOString()
        };
        const updated = [
            ...companies,
            newCompany
        ];
        setCompanies(updated);
        saveCompanies(updated);
        closeModal();
        showToast('Host company created successfully!');
    };
    const handleUpdateCompany = (data)=>{
        const updated = companies.map((c)=>c.id === selectedItem.id ? {
                ...c,
                ...data
            } : c);
        setCompanies(updated);
        saveCompanies(updated);
        closeModal();
        showToast('Company updated successfully!');
    };
    const handleDeleteCompany = (company)=>{
        setConfirmDialog({
            title: 'Delete Host Company',
            message: `Are you sure you want to delete ${company.company_name}? This will also remove all learner placements at this company.`,
            onConfirm: async ()=>{
                const adminId = sessionStorage.getItem('admin_id');
                if (!adminId) {
                    alert('Admin session expired. Please log in again.');
                    setConfirmDialog(null);
                    return;
                }
                try {
                    // Call backend DELETE endpoint
                    const res = await fetch(`https://seta-api-3g5xl.ondigitalocean.app/api/administrators/delete-host-company/${adminId}/${company.company_id}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete host company');
                    }
                    // Update frontend state
                    const updatedCompanies = companies.filter((c)=>c.company_id !== company.company_id);
                    const updatedPlacements = placements.filter((p)=>p.company_id !== company.company_id);
                    setCompanies(updatedCompanies);
                    setPlacements(updatedPlacements);
                    // Save to localStorage if needed
                    saveCompanies(updatedCompanies);
                    savePlacements(updatedPlacements);
                    showToast('Company deleted successfully!');
                } catch (err) {
                    console.error('Error deleting company:', err);
                    showToast('Failed to delete company. Please try again.', 'error');
                } finally{
                    setConfirmDialog(null);
                }
            },
            onCancel: ()=>setConfirmDialog(null)
        });
    };
    const toggleCompanyExpanded = (companyId)=>{
        setExpandedCompanies((prev)=>prev.includes(companyId) ? prev.filter((id)=>id !== companyId) : [
                ...prev,
                companyId
            ]);
    };
    // Placement handlers
    const handleCreatePlacement = (data)=>{
        if (Array.isArray(data)) {
            //Multiple placements
            const newPlacements = data.map((placement)=>({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    ...placement,
                    createdAt: new Date().toISOString()
                }));
            const updated = [
                ...placements,
                ...newPlacements
            ];
            setPlacements(updated);
            savePlacements(updated);
            closeModal();
            showToast(`${newPlacements.length} learner placement${newPlacements.length > 1 ? 's' : ''} created successfully!`);
        } else {
            //Single placement
            const newPlacement = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                ...data,
                createdAt: new Date().toISOString()
            };
            const updated = [
                ...placements,
                newPlacement
            ];
            setPlacements(updated);
            savePlacements(updated);
            closeModal();
            showToast('Learner placement created successfully!');
        }
    };
    const handleUpdatePlacement = (data)=>{
        const updated = placements.map((p)=>p.placement_id === selectedItem.placement_id ? {
                ...p,
                ...data
            } : p);
        setPlacements(updated);
        savePlacements(updated);
        closeModal();
        showToast('Placement updated successfully!');
    };
    const handleDeletePlacement = (placement)=>{
        setConfirmDialog({
            title: 'Delete Placement',
            message: `Are you sure you want to delete this learner placement?`,
            onConfirm: ()=>{
                const updated = placements.filter((p)=>p.placement_id !== placement.placement_id);
                setPlacements(updated);
                savePlacements(updated);
                setConfirmDialog(null);
                showToast('Placement deleted successfully!');
            },
            onCancel: ()=>setConfirmDialog(null)
        });
    };
    //get learners in seta not yet placed
    const getAvailableLearners = (agreementId)=>{
        if (!agreementId) return [];
        // Find allocations for this agreement
        const allocationsForCompany = allocatedLearners.filter((a)=>a.agreement_id === agreementId);
        // Learners already placed anywhere
        const placedStudentIds = new Set(placements.map((p)=>p.student_id?.trim().toLowerCase()));
        return allocationsForCompany.filter((allocation)=>{
            const studentId = allocation.student_id?.trim().toLowerCase();
            return studentId && !placedStudentIds.has(studentId);
        });
    };
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const totalCompanies = companies.length;
        const totalPlacements = placements.length;
        const totalCapacity = companies.reduce((sum, c)=>sum + parseInt(c.learnerCapacity || 0), 0);
        const aPlacements = placements.filter((p)=>p.status === 'Active').length;
        return {
            totalCompanies,
            totalPlacements,
            totalCapacity,
            aPlacements
        };
    }, [
        companies,
        placements
    ]);
    const filteredCompanies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return companies.filter((company)=>{
            const matchesSearch = searchTerm === '' || company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || company.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) || company.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSector = filterSector === '' || company.industry === filterSector;
            const matchesSETA = filterSETA === '' || company.agreement_id === filterSETA;
            return matchesSearch && matchesSector && matchesSETA;
        });
    }, [
        companies,
        searchTerm,
        filterSector,
        filterSETA
    ]);
    const getMouBadgeColor = (status)=>{
        switch(status){
            case 'Signed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };
    const getPlacementsByCompany = (companyId)=>{
        return placements.filter((p)=>p.company_id === companyId);
    };
    console.log("selectedItem content:", selectedItem);
    const programmeId = selectedItem?.programme_id || selectedItem?.programmeId || selectedItem?.programme?.id || selectedItem?.seta_programme_id;
    console.log("Resolved programmeId:", programmeId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen p-6",
        style: {
            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgLight
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b",
                        style: {
                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('companies'),
                                    className: `px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'companies' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 449,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Host Companies"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 450,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 448,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 440,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('placements'),
                                    className: `px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'placements' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 462,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "All Placements"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 463,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800",
                                                children: placements.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 464,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 461,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 453,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 439,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                        lineNumber: 438,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 437,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-6 shadow-sm border",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Total Companies"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 477,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            className: "w-5 h-5",
                                            style: {
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                    },
                                    children: stats.totalCompanies
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 475,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-6 shadow-sm border",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Active Placements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "w-5 h-5",
                                            style: {
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 486,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 484,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                    },
                                    children: stats.aPlacements
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 488,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 483,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-6 shadow-sm border",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Total Placements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 493,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                            className: "w-5 h-5",
                                            style: {
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].info
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 494,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                    },
                                    children: stats.totalPlacements
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 491,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-6 shadow-sm border",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Total Capacity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 501,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "w-5 h-5",
                                            style: {
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].secondary
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 502,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 500,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                    },
                                    children: stats.totalCapacity
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 474,
                    columnNumber: 9
                }, this),
                activeTab === 'companies' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-6 mb-6 shadow-sm",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 516,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Search by company name, registration, or contact...",
                                                        value: searchTerm,
                                                        onChange: (e)=>setSearchTerm(e.target.value),
                                                        className: "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                                        style: {
                                                            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 517,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 515,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 514,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: filterSETA,
                                                onChange: (e)=>setFilterSETA(e.target.value),
                                                className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                                style: {
                                                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "All SETAs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 534,
                                                        columnNumber: 21
                                                    }, this),
                                                    agreements.filter((a)=>a.status === 'Active').map((agreement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: agreement.agreement_id,
                                                            children: agreement.name
                                                        }, agreement.agreement_id, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 536,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 528,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 527,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: filterSector,
                                                onChange: (e)=>setFilterSector(e.target.value),
                                                className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
                                                style: {
                                                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "All Sectors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 549,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Manufacturing",
                                                        children: "Manufacturing"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 550,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Information Technology",
                                                        children: "Information Technology"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 551,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Engineering",
                                                        children: "Engineering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 552,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Healthcare",
                                                        children: "Healthcare"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 553,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Finance",
                                                        children: "Finance"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 554,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Retail",
                                                        children: "Retail"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 555,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Construction",
                                                        children: "Construction"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 556,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Education",
                                                        children: "Education"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 557,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Hospitality",
                                                        children: "Hospitality"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 558,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Other",
                                                        children: "Other"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 559,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 543,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 542,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 513,
                                    columnNumber: 15
                                }, this),
                                (searchTerm || filterSector || filterSETA) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600",
                                            children: [
                                                "Showing ",
                                                filteredCompanies.length,
                                                " of ",
                                                companies.length,
                                                " companies"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 566,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setSearchTerm('');
                                                setFilterSector('');
                                                setFilterSETA('');
                                            },
                                            className: "text-sm px-4 py-2 rounded-lg hover:bg-gray-100",
                                            style: {
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                            },
                                            children: "Clear Filters"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 569,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 565,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 512,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openModal('createCompany'),
                                className: "flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md",
                                style: {
                                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 590,
                                        columnNumber: 17
                                    }, this),
                                    "Add Host Company"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                lineNumber: 585,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 584,
                            columnNumber: 13
                        }, this),
                        filteredCompanies.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                            children: filteredCompanies.map((company)=>{
                                const companyPlacements = getPlacementsByCompany(company.id);
                                const activePlacements = companyPlacements.filter((p)=>p.status === 'Active').length;
                                const agreement = agreements.find((a)=>a.id === company.agreement_id);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow",
                                    style: {
                                        backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                        borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-xl font-bold mb-1",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                            },
                                                            children: company.company_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 607,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mb-2",
                                                            children: company.registration_number
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 610,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 606,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>openModal('viewCompany', company),
                                                            className: "p-2 rounded-lg hover:bg-gray-100",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                                            },
                                                            title: "View",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 626,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 620,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>openModal('editCompany', company),
                                                            className: "p-2 rounded-lg hover:bg-gray-100",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].secondary
                                                            },
                                                            title: "Edit",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 634,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 628,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDeleteCompany(company),
                                                            className: "p-2 rounded-lg hover:bg-gray-100",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                                            },
                                                            title: "Delete",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 642,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 636,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 619,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 605,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                                            className: "w-4 h-4 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 649,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: company.industry
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 650,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 648,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            className: "w-4 h-4 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 653,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: company.address
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 654,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 652,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                            className: "w-4 h-4 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 657,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: company.contact_person
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 658,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 656,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                            className: "w-4 h-4 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 661,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: company.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 662,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 660,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 647,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between pt-4 border-t",
                                            style: {
                                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-600",
                                                            children: "Capacity / Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 668,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lg font-bold",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                            },
                                                            children: [
                                                                company.student_capacity,
                                                                " / ",
                                                                activePlacementsByCompany[company.company_id] || 0
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 669,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 667,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>openModal('createPlacement', company),
                                                    className: "px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90",
                                                    style: {
                                                        backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].info,
                                                        color: 'white'
                                                    },
                                                    disabled: activePlacements >= parseInt(company.student_capacity),
                                                    children: "Place Learner"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 673,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 666,
                                            columnNumber: 23
                                        }, this),
                                        companyPlacements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 pt-4 border-t",
                                            style: {
                                                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>toggleCompanyExpanded(company.company_id),
                                                    className: "w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-sm font-semibold",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                            },
                                                            children: [
                                                                "Current Placements (",
                                                                companyPlacements.length,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 689,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            style: {
                                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                                            },
                                                            children: expandedCompanies.includes(company.company_id) ? '▼ Hide' : '▶ View'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 692,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 685,
                                                    columnNumber: 23
                                                }, this),
                                                expandedCompanies.includes(company.company_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 space-y-2",
                                                    children: companyPlacements.map((placement)=>{
                                                        const learner = allocatedLearners.find((l)=>l.id === placement.learnerId);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between text-sm p-2 rounded",
                                                            style: {
                                                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgLight
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: learner ? `${learner.firstName} ${learner.lastName}` : 'Unknown Learner'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                    lineNumber: 703,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-2 py-1 rounded text-xs ${placement.status === 'Active' ? 'bg-green-100 text-green-800' : placement.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`,
                                                                    children: placement.status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                    lineNumber: 706,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, placement.id, true, {
                                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                            lineNumber: 702,
                                                            columnNumber: 31
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                    lineNumber: 698,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 684,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, company.company_id, true, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 604,
                                    columnNumber: 21
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 597,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg p-12 shadow-sm text-center",
                            style: {
                                backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                    className: "w-16 h-16 mx-auto mb-4",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 726,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold mb-2",
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                    },
                                    children: searchTerm || filterSector ? 'No companies found' : 'No host companies yet'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 727,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mb-4",
                                    children: searchTerm || filterSector ? 'Try adjusting your filters' : 'Add your first host company to start managing placements'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 730,
                                    columnNumber: 17
                                }, this),
                                !(searchTerm || filterSector) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>openModal('createCompany'),
                                    className: "px-6 py-3 rounded-lg text-white font-medium hover:opacity-90",
                                    style: {
                                        backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success
                                    },
                                    children: "Add Host Company"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                    lineNumber: 736,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 725,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /* ALL PLACEMENTS VIEW */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$Table$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlacementStats"], {
                            placements: placements
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 750,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$Table$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            placements: placements,
                            allocatedLearners: allocatedLearners,
                            companies: companies,
                            students: aStudents,
                            onView: (placement)=>openModal('viewPlacement', placement),
                            onEdit: (placement)=>openModal('editPlacement', placement),
                            onDelete: handleDeletePlacement
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                            lineNumber: 751,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 749,
                    columnNumber: 13
                }, this),
                showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                        style: {
                            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-0 flex items-center justify-between p-6 border-b",
                                style: {
                                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].bgWhite,
                                    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].border
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: [
                                            modalType === 'createCompany' && 'Add Host Company',
                                            modalType === 'editCompany' && 'Edit Host Company',
                                            modalType === 'viewCompany' && 'Company Details',
                                            modalType === 'createPlacement' && 'Place Learner',
                                            modalType === 'editPlacement' && 'Edit Placement'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 768,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeModal,
                                        className: "p-2 rounded-lg hover:bg-gray-100",
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                            lineNumber: 780,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 775,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                lineNumber: 767,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    modalType === 'createCompany' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$HostCompanyForm$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        agreements: agreements,
                                        onSubmit: handleCreateCompany,
                                        onCancel: closeModal
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 786,
                                        columnNumber: 19
                                    }, this),
                                    modalType === 'editCompany' && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$HostCompanyForm$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        company: selectedItem,
                                        agreements: agreements,
                                        onSubmit: handleUpdateCompany,
                                        onCancel: closeModal
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 794,
                                        columnNumber: 19
                                    }, this),
                                    modalType === 'viewCompany' && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "SETA Agreement"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 806,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: [
                                                                    agreements.find((a)=>a.agreement_id === selectedItem.agreement_id)?.name || 'N/A',
                                                                    " -",
                                                                    agreements.find((a)=>a.agreement_id === selectedItem.agreement_id)?.reference_number || 'N/A'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 807,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 805,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Company Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 813,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.company_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 814,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 812,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Registration Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 817,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.registration_number
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 818,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 816,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 821,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.address
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 822,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 820,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Industry Sector"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 825,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.industry
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 826,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 824,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Learner Capacity"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 829,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.student_capacity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 830,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 828,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Contact Person"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 833,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.contact_person
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 834,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 832,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Email"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 837,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 838,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 836,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Phone"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 841,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                                },
                                                                children: selectedItem.phone
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 842,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 840,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-1",
                                                                children: "Confirmation Letter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 845,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold",
                                                                style: {
                                                                    color: selectedItem.confirmation ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].success : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].danger
                                                                },
                                                                children: selectedItem.confirmation ? 'Received' : 'Not Received'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                                lineNumber: 846,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 844,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 804,
                                                columnNumber: 21
                                            }, this),
                                            selectedItem.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 mb-1",
                                                        children: "Notes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 854,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        style: {
                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].primary
                                                        },
                                                        children: selectedItem.notes
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                        lineNumber: 855,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 853,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: closeModal,
                                                className: "w-full px-6 py-3 rounded-lg text-white font-medium hover:opacity-90",
                                                style: {
                                                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORS"].text
                                                },
                                                children: "Close"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                                lineNumber: 859,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 803,
                                        columnNumber: 19
                                    }, this),
                                    modalType === 'createPlacement' && showModal && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$LearnerPlacement$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        companyId: selectedItem.company_id,
                                        availableLearners: getAvailableLearners(selectedItem.agreement_id),
                                        studentInfo: aStudents,
                                        onSubmit: handleCreatePlacement,
                                        onCancel: closeModal
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 870,
                                        columnNumber: 19
                                    }, this),
                                    modalType === 'editPlacement' && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Hosts$2f$LearnerPlacement$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        placement: selectedItem,
                                        companyId: selectedItem.company_id,
                                        availableLearners: [
                                            ...getAvailableLearners(selectedItem.programme_id),
                                            selectedItem // ensure current learner stays selectable
                                        ],
                                        studentInfo: aStudents,
                                        onSubmit: handleUpdatePlacement,
                                        onCancel: closeModal
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                        lineNumber: 880,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                                lineNumber: 784,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                        lineNumber: 766,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 765,
                    columnNumber: 11
                }, this),
                toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ToastNotifications$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    message: toast.message,
                    type: toast.type,
                    onClose: ()=>setToast(null)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 899,
                    columnNumber: 11
                }, this),
                confirmDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ConfirmDialogue$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    title: confirmDialog.title,
                    message: confirmDialog.message,
                    onConfirm: confirmDialog.onConfirm,
                    onCancel: confirmDialog.onCancel
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
                    lineNumber: 908,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
            lineNumber: 434,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/Hosts/HostCompanyManagement.jsx",
        lineNumber: 433,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_components_5777cf5b._.js.map