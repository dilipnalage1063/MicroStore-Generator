import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/**
 * Home Component
 * Provides a form to create a new micro-store.
 */
const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null); // To store created store info
    const [slugSuffix] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

    // Local state for form fields
    const [shopName, setShopName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [upi, setUpi] = useState('');
    const [products, setProducts] = useState([
        { name: '', price: '' },
        { name: '', price: '' }
    ]);

    // Load saved details on mount - Removed persistence as per user request
    useEffect(() => {
        // Form now starts empty for every new session
    }, []);

    // Helper: Slugify shop name
    const generateSlug = (text, suffix = '') => {
        const base = text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')  // Remove all non-word chars
            .replace(/--+/g, '-');    // Replace multiple - with single -

        return suffix ? `${base}-${suffix}` : base;
    };

    // Handle product input changes
    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    // add more product fields (max 5)
    const addProductField = () => {
        if (products.length < 5) {
            setProducts([...products, { name: '', price: '' }]);
        }
    };

    /**
     * Validation logic for the form fields
     */
    const validateForm = () => {
        // 1. Shop Name: 3-50 chars
        if (shopName.trim().length < 3) {
            alert("Shop Name must be at least 3 characters long.");
            return false;
        }
        if (shopName.trim().length > 50) {
            alert("Shop Name must be under 50 characters.");
            return false;
        }

        // 2. Description: Max 200 chars
        if (description.trim().length > 200) {
            alert("Description must be under 200 characters.");
            return false;
        }

        // 3. Phone: Exactly 10 digits (Standard Indian format for MicroStore)
        const phoneRegex = /^[6789]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            alert("Please enter a valid 10-digit Phone Number.");
            return false;
        }

        // 4. UPI ID: username@bankname
        const upiRegex = /^[\w.-]+@[\w.-]+$/;
        if (!upiRegex.test(upi)) {
            alert("Please enter a valid UPI ID (e.g. username@upi).");
            return false;
        }

        // 5. Products check
        const validProducts = products.filter(p => p.name.trim() !== '' && p.price.trim() !== '');
        if (validProducts.length === 0) {
            alert("Please add at least one product with name and price.");
            return false;
        }

        // 6. Price: Must be positive number
        for (let p of validProducts) {
            const numPrice = parseFloat(p.price);
            if (isNaN(numPrice) || numPrice <= 0) {
                alert(`Invalid price for "${p.name}". Please enter a positive number.`);
                return false;
            }
        }

        return validProducts;
    };

    /**
     * Submit logic to write data to Firestore
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validatedProducts = validateForm();
        if (!validatedProducts) return;

        setLoading(true);
        try {
            const slug = generateSlug(shopName, slugSuffix);
            const storeData = {
                shopName: shopName.trim(),
                description: description.trim(),
                phone: phone.trim(),
                upi: upi.trim(),
                products: validatedProducts,
                createdAt: serverTimestamp(),
            };

            // Use setDoc with a custom slug as ID
            await setDoc(doc(db, 'stores', slug), storeData);

            // Set success state instead of navigating immediately
            const storeUrl = `${window.location.origin}/store/${slug}`;
            setSuccessData({ slug, url: storeUrl });

            // Scroll to top to see success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            alert("Failed to create store. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(successData.url);
        alert("Store link copied to clipboard!");
    };

    const shareOnWhatsApp = () => {
        const message = `Check out my online store: ${successData.url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (successData) {
        return (
            <div className="container">
                <div className="store-header">
                    <h1 style={{ color: '#10b981' }}>🎉 Store Created!</h1>
                    <p>Your store is live and ready to share.</p>
                </div>

                <div className="card success-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>{shopName}</h2>
                    <div className="url-box" style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        wordBreak: 'break-all',
                        border: '1px solid #e2e8f0',
                        margin: '1.5rem 0'
                    }}>
                        {successData.url}
                    </div>

                    <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={copyToClipboard} className="btn-primary">
                            📋 Copy Store Link
                        </button>
                        <button onClick={shareOnWhatsApp} className="btn-whatsapp" style={{ backgroundColor: '#25D366', color: 'white' }}>
                            💬 Share on WhatsApp
                        </button>
                        <button onClick={() => setSuccessData(null)} className="btn-outline">
                            ➕ Create Another
                        </button>
                        <button onClick={() => navigate(`/store/${successData.slug}`)} className="btn-outline" style={{ border: 'none' }}>
                            View Store Page →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="store-header">
                <h1>MicroStore Generator</h1>
                <p>Create your online store page link instantly!</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Shop Name (Required)</label>
                        <input
                            type="text"
                            placeholder="e.g. Fresh Bakes"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            required
                        />
                        {shopName && (
                            <small style={{ color: '#64748b' }}>
                                Your link will be: {window.location.origin}/store/{generateSlug(shopName, slugSuffix)}
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="2"
                            placeholder="What do you sell?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Products (Up to 5)</label>
                        {products.map((product, index) => (
                            <div key={index} className="product-entry">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Price (₹)"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                />
                            </div>
                        ))}
                        {products.length < 5 && (
                            <button type="button" onClick={addProductField} className="btn-outline" style={{ marginTop: '0.5rem', width: 'auto' }}>
                                + Add Product
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label>WhatsApp / Phone Number</label>
                        <input
                            type="tel"
                            placeholder="e.g. 919876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>UPI ID (for payments)</label>
                        <input
                            type="text"
                            placeholder="e.g. username@upi"
                            value={upi}
                            onChange={(e) => setUpi(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Store...' : 'Create Instant Store & Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
