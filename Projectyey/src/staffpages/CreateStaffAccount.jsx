import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav from '../components/Nav';
import { button } from "@material-tailwind/react";

function CreateStaffAccount(){
    const [idnumber, setIdnumber] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        // Automatically set the password to the lastname in all capital letters
        setPassword(lastname.toUpperCase());
    }, [lastname]);

    const handleChange = async () => {
        // Check if any of the required fields are empty
        if (!idnumber || !firstname || !lastname || !birthdate || !email || !password || !gender) {
            showModal("Error", "Please fill in all required fields.");
            return;
        }

        // Format ID
        const idPattern = /^\d{2}-\d{4}-\d{3}$/;
        // Check if the entered ID matches the expected format
        if (!idPattern.test(idnumber)) {
            showModal("Error", "Invalid ID format. Please enter ID in the format xx-xxxx-xxx");
            return;
        }

        // Normalize and validate email
        const normalizedEmail = validEmail(email);
        if (!normalizedEmail) {
            return;
        }

        const staff_data = {
            idNumber: idnumber,
            firstname: firstname,
            lastname: lastname,
            birthdate: birthdate,
            gender: gender,
            email: email,
            password: password
        }
        try {
            const response = await axios.post("http://localhost:8080/staff/insertStaff", staff_data);
            console.log(response.data);
            console.log("Submitted!");
            showModal("Success", "Data submitted successfully!");
        } catch (error) {
            console.error(error);
            showModal("Error", "An error occurred while submitting data.");
        }

        setIdnumber("");
        setFirstname("");
        setLastname("");
        setBirthdate("");
        setEmail("");
        setGender("");
        setPassword("");
    };

    // Function to validate and normalize email format
    const validEmail = (email) => {
        // Regular expression for email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Check if email matches the pattern
        if (!emailPattern.test(email)) {
            // Handle invalid email address
            showModal("Error", "Invalid email address");
            return null;
        }

        // Normalize email to lowercase
        return email.toLowerCase();
    };

    const showModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        document.getElementById('my_modal_1').showModal();
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <div className="ml-[265px] min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ">
            <Nav/>
            <img src="src/image/logo.png" alt="Logo" className="absolute top-0 left-5 ml-[265px] object-center"/>

            <div className="w-full max-w-4xl p-8 space-y-6 bg-[#88343B] rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-white">Create Staff Account</h1>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type='text'
                        placeholder='Enter ID Number'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        value={idnumber}
                        onChange={(e) => setIdnumber(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Enter Firstname'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Enter Lastname'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />

                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        <input
                            type='date'
                            placeholder='Select Birthdate'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                        <div className="flex items-center space-x-4">
                            <label className="text-white">Gender:</label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={handleGenderChange}
                                />
                                <span className="ml-2 text-white">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={handleGenderChange}
                                />
                                <span className="ml-2 text-white">Female</span>
                            </label>
                        </div>
                    </div>

                    <input
                        type='text'
                        placeholder='Enter Email'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Enter Password'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        readOnly // Make the password field read-only
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 bg-[#F7C301] text-white font-bold rounded-lg hover:bg-[#F7C301]"
                        type="submit"
                        onClick={handleChange}
                    >
                        Create Account
                    </button>
                </div>

                {/* Modal */}
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{modalTitle}</h3>
                        <p className="py-4">{modalMessage}</p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
}

export default CreateStaffAccount;