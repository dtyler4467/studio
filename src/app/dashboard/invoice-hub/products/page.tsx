
"use client";

import React from 'react';
// This can be a re-export or a direct import if you move the component
import StorePage from '../../store/products/page';

export default function InvoiceProductsPage() {
    // We are re-using the StorePage component for a consistent product management experience.
    // In a real-world scenario, you might have different logic or components,
    // but for this prototype, re-use is efficient.
    return <StorePage />;
}

    