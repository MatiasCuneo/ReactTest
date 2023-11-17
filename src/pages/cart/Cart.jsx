import React, { useState } from 'react';
import NavBar from '../../components/navbar/navbar.jsx';
import Footer from '../../components/footer/footer.jsx';
import './cart.css';
import axios from 'axios';

export default function Cart({productos}) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        if (cartItems[product.id]) {
            const updatedCart = { ...cartItems };
            updatedCart[product.id].quantity += 1;
            setCartItems(updatedCart);
        } else {
            setCartItems({
            ...cartItems,
            [product.id]: { ...product, quantity: 1 },
            });
        }
    };

    const removeFromCart = (productId) => {
        const updatedCart = { ...cartItems };

        if (updatedCart[productId]) {
            if (updatedCart[productId].quantity > 1) {
                updatedCart[productId].quantity -= 1;
            } else {
                delete updatedCart[productId];
            }

            setCartItems(updatedCart);
        }
    };

    const keys = ["id", "quantity"];
    const filteredCart = Object.fromEntries(Object.entries(cartItems).filter(([key]) => keys.includes(key)));

    const jsonifiedCart = JSON.stringify(filteredCart, null, 2);

    const handleCart = async () => {
        try {
            await axios.post('http://localhost:8080/cart', {jsonifiedCart});

            alert('Articulos comprados con exito');
        } catch (err) {
            alert('Error al realizar la compra');
            console.log("Error al registrar carrito: ", err)
        }
    };

    return (
        <div className="Cart">
            <NavBar />
            <div className="discover">
                <div className="products">
                    <ul>
                        <h1>Categoria 1</h1>
                        <div className="items">
                            {productos.map(producto => (
                                <li className="item_style" key={producto.id}>
                                    <img src={producto.image} alt={producto.name} />
                                    <h3><b>{producto.name}</b> - {producto.price}</h3>
                                    <p>{producto.description}</p>
                                    <button className="mainBtn" onClick={() => addToCart(producto)}>Añadir</button>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
                <div className="cart">
                    <h1>Carrito</h1>
                    <hr />
                    <div className="pushed">
                        {Object.values(cartItems).map((item) => (
                            <div className="item_style" key={item.id}>
                                <img src={item.image} alt={item.name} />
                                <h3>
                                {item.name} - {Number((item.price * item.quantity)).toFixed(1)}
                                </h3>
                                <p>Cantidad: {item.quantity}</p>
                                <button className="mainBtn" onClick={() => removeFromCart(item.id)}>
                                Quitar
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="mainBtn" onClick={handleCart}>Comprar</button>
                </div>
            </div>
            <p>
            {JSON.stringify(cartItems, null, 2)}
            </p>
            <Footer />
        </div>
    );
}
