import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/**
 * Home Component
 * Provides a form to create a new micro-store.
 */
const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Local state for form fields
    const [shopName, setShopName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [upi, setUpi] = useState('');
    const [products, setProducts] = useState([
        { name: '', price: '' },
        { name: '', price: '' }
    ]);

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
        // 1. Shop Name validation
        if (shopName.trim().length < 3) {
            alert("Shop Name must be at least 3 characters long.");
            return false;
        }

        // 2. Phone Number validation (Generic 10-12 digits)
        const phoneRegex = /^[0-9]{10,12}$/;
        if (!phoneRegex.test(phone)) {
            alert("Please enter a valid Phone Number (10-12 digits, no spaces or characters).");
            return false;
        }

        // 3. UPI ID validation (simple regex: username@provider)
        const upiRegex = /^[\w.-]+@[\w.-]+$/;
        if (!upiRegex.test(upi)) {
            alert("Please enter a valid UPI ID (e.g. username@upi).");
            return false;
        }

        // 4. Products validation (At least one product with name and price)
        const validProducts = products.filter(p => p.name.trim() !== '' && p.price.trim() !== '');
        if (validProducts.length === 0) {
            alert("Please add at least one product with a name and price.");
            return false;
        }

        // 5. Price validation (Must be numeric)
        for (let p of validProducts) {
            if (isNaN(p.price)) {
                alert(`Invalid price for "${p.name}". Please enter numbers only.`);
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

        // Run all validations
        const validatedProducts = validateForm();
        if (!validatedProducts) return;

        setLoading(true);
        try {
            const storeData = {
                shopName: shopName.trim(),
                description: description.trim(),
                phone: phone.trim(),
                upi: upi.trim(),
                products: validatedProducts,
                createdAt: serverTimestamp(),
            };

            // Add document to 'stores' collection
            const docRef = await addDoc(collection(db, 'stores'), storeData);

            // Redirect to the public store page
            navigate(`/store/${docRef.id}`);
        } catch (error) {
            console.error("Error creating store:", error);
            alert("Failed to create store. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

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
                        {loading ? 'Creating Store...' : 'Create Instant Store'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
