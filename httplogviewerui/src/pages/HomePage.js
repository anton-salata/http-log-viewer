import React, { useState, useEffect } from 'react';
import WebLogo from '../images/logo_wood.png';
import LogTable from '../components/LogTable';

function HomePage() {
    return (
        <div style={{ backgroundColor: "aliceblue" }}>
            <div class="container">
                <a class="text-white" href="/"> <img src={WebLogo} alt="..." style={{ height: "100px", marginLeft: "15px", height: "85px", marginTop: "50px", marginBottom: "10px" }} />
                </a>
            </div>

            <div class="container">
                <LogTable />
            </div>

            <div class="row" style={{ height: 500 }}>
                <div class="col">

                </div>
            </div>


            <div class="row bg-dr" style={{ height: 500 }}>
                <div class="col">

                </div>
            </div>


            {/* <!-- Footer Section -->*/}
            <footer class="footer">
                <div class="container text-center">
                    <p style={{ color: "black" }}>&copy; 2024 Mastermind Mutants Mob</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
