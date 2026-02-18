import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * StoreView Component
 * Fetches and displays store data by ID.
 */
const StoreView = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch store data on load
    useEffect(() => {
        const fetchStore = async () => {
            try {
                const docRef = doc(db, 'stores', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setStore(docSnap.data());
                } else {
                    // Store not found
                }
            } catch (error) {
                // Error handled by not setting store
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [id]);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}><h2>Loading Store...</h2></div>;
    }

    if (!store) {
        return (
            <div className="container not-found">
                <h2>Store Not Found</h2>
                <p>The link you followed might be incorrect or the store was deleted.</p>
                <a href="/" className="btn-outline" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Create Your Own Store</a>
            </div>
        );
    }

    // UPI payment link: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR
    const upiLink = `upi://pay?pa=${store.upi}&pn=${encodeURIComponent(store.shopName)}&cu=INR`;

    // WhatsApp order link: https://wa.me/NUMBER?text=MESSAGE
    const whatsappLink = `https://wa.me/${store.phone}?text=${encodeURIComponent("Hi! I'd like to place an order from " + store.shopName)}`;

    return (
        <div className="container">
            <div className="store-header">
                <h1>{store.shopName}</h1>
                <p className="store-description">{store.description}</p>
            </div>

            <div className="card">
                <h3>Product Menu</h3>
                <ul className="product-list">
                    {store.products && store.products.map((item, index) => (
                        <li key={index} className="product-item">
                            <span>{item.name}</span>
                            <span className="price">₹{item.price}</span>
                        </li>
                    ))}
                </ul>

                <div className="action-buttons">
                    <a href={`tel:${store.phone}`} className="btn-action btn-call">
                        📞 Call Now
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-action btn-whatsapp">
                        💬 Order on WhatsApp
                    </a>
                    <a href={upiLink} className="btn-action btn-upi">
                        💸 Pay via UPI
                    </a>
                </div>
            </div>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                Powered by MicroStore Generator
            </p>
        </div>
    );
};

export default StoreView;
