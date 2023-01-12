import MainLayout from '../layout/MainLayout';
import Link from 'next/link'
import {
    ArrowLeftIcon,
} from '@heroicons/react/20/solid';
import {
    GreenButton, GreenSubmitButton, TableRow,
    WhiteButton,
} from '../components/OrderTable';
import {addOrder, getAllCustomers, getAllEmployees, addCustomerIfNotExists} from "./sql";

export async function getServerSideProps() {
    const {findAllCustomers} = await getAllCustomers("id firstName lastName city postalCode")
    const {findAllEmployees} = await getAllEmployees("id name")

    return {
        props: {
            findAllCustomers,
            findAllEmployees
        },
    }
}

function updateTotalPriceField(){
    let price = parseFloat(document.getElementById("orderPrice").value);
    if(document.querySelector('input[name="includeDeliveryCosts"]:checked').value
        === "yes"){
        if(document.getElementById("receiverPlace").value.toLowerCase() === "hoogeveen"){
            price += 4.50;
        } else {
            price += 5.95;
        }
    }
    document.getElementById("totalPrice").value = price
}

async function handleFormSubmit(customers){
    console.log(customers)
    let cardSelection = document.querySelector('input[name="cardSelect"]:checked').value;
    let includeDeliveryCosts = document.querySelector('input[name="includeDeliveryCosts"]:checked').value;

    let price = parseFloat(document.getElementById("totalPrice").value)
    if(isNaN(price)){
        alert("De gegeven prijs is ongeldig.")
        return
    }

    let customer = await addCustomerIfNotExists(customers,
        document.getElementById('customerFirstName').value,
        document.getElementById('customerLastName').value,
        document.getElementById('customerPhoneNumber').value,
        document.getElementById('customerPlace').value,
        document.getElementById('customerStreet').value,
        document.getElementById('customerStreetNumber').value,
        document.getElementById('customerPostalCode').value,
    )

    console.log(customer)


    let receiver = await addCustomerIfNotExists(customers,
        document.getElementById('receiverFirstName').value,
        document.getElementById('receiverLastName').value,
        document.getElementById('receiverPhoneNumber').value,
        document.getElementById('receiverPlace').value,
        document.getElementById('receiverStreet').value,
        document.getElementById('receiverStreetNumber').value,
        document.getElementById('receiverPostalCode').value,
    )
    console.log(receiver)

    console.log(document.getElementById('deliveryDate').value)

    let splitDate = document.getElementById('deliveryDate').value.split("-")
    let date = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]

    let order = await addOrder(
        customer.id,
        parseInt(document.getElementById('employee').value),
        receiver.id,
        date,
        price,
        "CASH",
        document.getElementById('extraInfo').value,
        document.getElementById('productInfo').value,
        document.getElementById('productMessage').value,
        "OPEN",
        includeDeliveryCosts === "yes",
        cardSelection === "card-free" ? "BASIC_CARD" :
            cardSelection === "card-ribbon" ? "RIBBON" :
                cardSelection === "card-wish" ? "SPECIAL_CARD" : "NONE"
    )
    if (order.error) {
        alert(order.error.message);
    }
}

export default function AddOrder({findAllCustomers, findAllEmployees}) {
    return (
        <MainLayout>
            <div
                className={`font-['Roboto'] ml-[5%] mt-[2%] border-b-gray-400 border-b-[1px] w-[90%]`}
            >
                <div
                    className={`flex font-['Roboto'] ml-[1%] mb-[1%] w-[150px] justify-between`}
                >
                    <Link
                        className={`mr-[50px]`}
                        href={'/'}
                    >
                        <ArrowLeftIcon
                            className="h-5 w-5 pr-[2%] inline-block"
                            aria-hidden="true"
                        />
                        Dashboard
                    </Link>
                </div>
                <div className={`flex justify-between w-[100%] mb-3`}>
                    <div className={`font-['Roboto'] text-2xl font-bold`}>
                        Voeg order toe
                    </div>
                    <WhiteButton link="#">Exporteer bestellingen</WhiteButton>
                </div>
            </div>
            <div className={`flex mt-10 w-5/6 ml-[8%] flex-col`}>
                <div className={` bg-[#DEF2E6] h-10 w-[100%] rounded-t-2xl`}>
                    <p className={`ml-5 mt-2`}>Klant gegevens</p>
                </div>
                <form className={` w-[100%]`}>
                    <div className={`w-[100%] mt-10 flex flex-col sm:flex-row justify-between`}>
                        <div className={`border-[1px]flex-col w-[45%] ml-[2%]`}>
                            <div className={`font-['Roboto'] text-1xl font-bold`}>
                                Besteller
                            </div>
                            <formHtml
                                className={`mt-1`}
                            >
                                <div className={`flex flex-col`}>
                                    <label htmlFor="customerCompanyName">Naam opdrachtgever</label>
                                    <input
                                        className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                        type="text"
                                        name="customerCompanyName"
                                        id="customerCompanyName"
                                    ></input>
                                </div>
                                <div
                                    className={`flex flex-col lg:flex-row justify-between mt-[3%]`}>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="customerFirstName">
                                            Voornaam contactpersoon
                                        </label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="customerFirstName"
                                            id="customerFirstName"
                                        ></input>
                                    </div>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="customerLastName">
                                            Achternaam contactpersoon
                                        </label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="customerLastName"
                                            id="customerLastName"
                                        ></input>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-col lg:flex-row justify-between mt-[3%]`}>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="customerStreet">Straatnaam</label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="customerStreet"
                                            id="customerStreet"
                                        ></input>
                                    </div>
                                    <div className={`flex w-[100%] lg:w-[48%] justify-between`}>
                                        <div className={`flex flex-col`}>
                                            <label htmlFor="customerStreetNumber">Nummer</label>
                                            <input required
                                                className={`border-[1px] border-gray-500 h-[25px] w-[95%]`}
                                                type="text"
                                                name="customerStreetNumber"
                                                id="customerStreetNumber"
                                            ></input>
                                        </div>
                                        <div className={`flex flex-col`}>
                                            <label htmlFor="customerPostalCode">Postcode</label>
                                            <input required
                                                className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                                type="text"
                                                name="customerPostalCode"
                                                id="customerPostalCode"
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex flex-col mt-[3%]`}>
                                    <label htmlFor="customerPlace">Plaats</label>
                                    <input required
                                        className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                        type="text"
                                        name="customerPlace"
                                        id="customerPlace"
                                    ></input>
                                </div>
                                <div className={`flex flex-col mt-[3%]`}>
                                    <label htmlFor="customerPhoneNumber">
                                        Telefoonnummer
                                    </label>
                                    <input required
                                        className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                        type="text"
                                        name="customerPhoneNumber"
                                        id="customerPhoneNumber"
                                    ></input>
                                </div>
                                <div className={`flex flex-col  mt-[3%]`}>
                                    <label className={`mt-[3%]`}>Bezorgkosten</label>
                                    <div className={`flex w-[30%] justify-between lg:w-[20%]`}>
                                        <div className={`flex justify-between`}>
                                            <input required
                                                className={`accent-[#009A42]`}
                                                type="radio"
                                                name="includeDeliveryCosts"
                                                id="includeDeliveryCosts"
                                                value="yes"
                                                   checked="checked"
                                                   onChange={() => {
                                                       updateTotalPriceField()
                                                   }
                                                   }
                                            ></input>
                                            <label
                                                className={`ml-1`}
                                                htmlFor="includeDeliveryCosts">
                                                Ja
                                            </label>
                                        </div>
                                        <div className={`flex justify-between sm:ml[0px] ml-[5%]`}>
                                            <input
                                                className={`accent-[#009A42]`}
                                                type="radio"
                                                name="includeDeliveryCosts"
                                                id="includeDeliveryCosts"
                                                value="no"
                                                onChange={() => {
                                                    updateTotalPriceField()

                                                }
                                                }
                                            ></input>
                                            <label
                                                className={`ml-1`}
                                                htmlFor="includeDeliveryCosts">
                                                Nee
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-col lg:flex-row justify-between mt-[3%]`}>
                                    <div className={`flex flex-col w-[100%]`}>
                                        <label
                                            className={`w-[200px]`}
                                            htmlFor="deliveryDate">
                                            Datum van bezorging
                                        </label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-6 w-[100%] lg:w-[200px]`}
                                            type="date"
                                            name="deliveryDate"
                                            id="deliveryDate"
                                        ></input>
                                    </div>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="deliveryMethod">Verzending</label>
                                        <select required
                                            className={`border-[1px] border-gray-500`}
                                            name="deliveryMethod"
                                            id="deliveryMethod">
                                            <option value="pickup">Afhalen</option>
                                            <option value="deliver">Bezorging</option>
                                        </select>
                                    </div>
                                </div>
                            </formHtml>
                        </div>
                        <div className={` sm:mt-[0px] mt-[10%] sm:ml-[0px] ml-[2%] flex-col w-[45%] mr-[2%] pb-1`}>
                            <div className={`font-['Roboto'] text-1xl font-bold`}>
                                Ontvanger
                            </div>
                            <formHtml
                                className={`mt-1`}
                                method="POST"
                                action="">
                                <div className={`flex flex-col lg:flex-row justify-between`}>
                                    <div className={`flex flex-col`}>
                                        <label
                                            className={'w-[150px]'}
                                            htmlFor="receiverFirstName">
                                            Naam ontvanger
                                        </label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="receiverFirstName"
                                            id="receiverFirstName"
                                        ></input>
                                    </div>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="receiverLastName">Achternaam</label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="receiverLastName"
                                            id="receiverLastName"
                                        ></input>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-col lg:flex-row justify-between mt-[3%]`}>
                                    <div className={`flex flex-col`}>
                                        <label htmlFor="receiverStreet">Straatnaam</label>
                                        <input required
                                            className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                            type="text"
                                            name="receiverStreet"
                                            id="receiverStreet"
                                        ></input>
                                    </div>
                                    <div className={`flex w-[100%] lg:w-[45%] justify-between`}>
                                        <div className={`flex flex-col`}>
                                            <label htmlFor="receiverStreetNumber">Nummer</label>
                                            <input required
                                                className={`border-[1px] border-gray-500 h-[25px] w-[95%]`}
                                                type="text"
                                                name="receiverStreetNumber"
                                                id="receiverStreetNumber"
                                            ></input>
                                        </div>
                                        <div className={`flex flex-col`}>
                                            <label htmlFor="receiverPostalCode">Postcode</label>
                                            <input required
                                                className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                                type="text"
                                                name="receiverPostalCode"
                                                id="receiverPostalCode"
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex flex-col  mt-[3%]`}>
                                    <label htmlFor="receiverPlace">Plaats</label>
                                    <input required onChange={() => {
                                        updateTotalPriceField()
                                    }
                                    }
                                        className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                        type="text"
                                        name="receiverPlace"
                                        id="receiverPlace"
                                    ></input>
                                </div>
                                <div className={`flex flex-col  mt-[3%]`}>
                                    <label htmlFor="receiverPhoneNumber">
                                        Telefoonnummer
                                    </label>
                                    <input required
                                        className={`border-[1px] border-gray-500 h-[25px] w-[100%]`}
                                        type="text"
                                        name="receiverPhoneNumber"
                                        id="receiverPhoneNumber"
                                    ></input>
                                </div>
                                <div
                                    className={`flex flex-col sm:flex-row justify-between mt-[3%]`}
                                >
                                    <div className={`flex flex-col`}>
                                        <label
                                            className={'w-[122px]'}
                                            htmlFor="orderPrice">
                                            Prijs bestelling
                                        </label>
                                        <input required onChange={() => {
                                            updateTotalPriceField()
                                        }
                                        }
                                            className={`border-[1px] border-gray-500 h-[25px] sm:w-[50%] w-[100%]`}
                                            type="text"
                                            name="orderPrice"
                                            id="orderPrice"
                                        ></input>
                                    </div>
                                    <div className={`flex flex-col`}>
                                        <label
                                            className={'w-[130px]'}
                                            htmlFor="totalPrice">
                                            Prijs totaal
                                        </label>
                                        <input disabled
                                            className={`border-[1px] bg-gray-200 border-gray-500 h-[25px] sm:w-[50%] w-[100%]`}
                                            type="text"
                                            name="totalPrice"
                                            id="totalPrice"
                                        ></input>
                                    </div>
                                </div>
                            </formHtml>
                        </div>
                    </div>
                    <div
                        className={`w-[100%] mt-20 flex flex-col sm:flex-row justify-between border-t-gray-400 border-t-[1px] pb-5`}>
                        <div className={`border-[1px]flex-col w-[45%] ml-[2%] mt-[50px]`}>
                            <div className={`font-['Roboto'] text-1xl font-bold`}>
                                Product
                            </div>
                            <formHtml>
                                <div className={`flex flex-col`}>
                                    <label
                                        className={`mt-3`}
                                        htmlFor="productInfo">
                                        Omschrijving bestelling
                                    </label>
                                    <textarea required
                                        className={`border-[1px] border-gray-500 h-[80px] resize-none`}
                                        name="productInfo"
                                        id="productInfo"
                                    ></textarea>
                                </div>
                                <div className={`flex flex-col`}>
                                    <label
                                        className={`mt-3 w-[100%]`}
                                        htmlFor="productMessage">
                                        Optioneel tekst voor op het kaartje
                                    </label>
                                    <textarea
                                        className={`border-[1px] border-gray-500 h-[80px] resize-none`}
                                        name="productMessage"
                                        id="productMessage"
                                    ></textarea>
                                </div>
                                <div className={`flex flex-col`}>
                                    <label
                                        className={`mt-3`}
                                        htmlFor="extraInfo">
                                        Bijzonderheden
                                    </label>
                                    <textarea
                                        className={`border-[1px] border-gray-500 h-[80px] resize-none`}
                                        name="extraInfo"
                                        id="extraInfo"
                                    ></textarea>
                                </div>
                            </formHtml>
                        </div>
                        <div className={`flex-col w-[45%] mr-[2%] mt-[110px]`}>
                            <div className={`flex flex-col md:flex-row md:ml-[0px] ml-[5%]`}>
                                <div className={`w-[82%] flex flex-col`}>
                                    <div className={` w-[100%] `}>
                                        <input required
                                            className={`accent-[#009A42]`}
                                            type="radio"
                                            name="cardSelect"
                                            id="cardSelect"
                                            value="card-free"
                                        ></input>
                                        <label
                                            className={`ml-[5px]`}
                                            htmlFor="cardSelect">
                                            Gratis kaartje
                                        </label>
                                    </div>
                                    <div className={`w-[100%]`}>
                                        <input
                                            className={`accent-[#009A42]`}
                                            type="radio"
                                            name="cardSelect"
                                            id="cardSelect"
                                            value="card-none"
                                        ></input>
                                        <label
                                            className={`ml-[5px]`}
                                            htmlFor="cardSelect">
                                            Geen kaartje
                                        </label>
                                    </div>
                                </div>
                                <div className={` w-[90%] flex flex-col`}>
                                    <div className={` w-[100%] flex`}>
                                        <input
                                            className={`accent-[#009A42]`}
                                            type="radio"
                                            name="cardSelect"
                                            id="cardSelect"
                                            value="card-ribbon"
                                        ></input>
                                        <label
                                            className={`ml-[5px]`}
                                            htmlFor="cardSelect">
                                            Speciaal wenslintje
                                        </label>
                                    </div>
                                    <div className={` w-[100%] flex`}>
                                        <input
                                            className={`accent-[#009A42]`}
                                            type="radio"
                                            name="cardSelect"
                                            id="cardSelect"
                                            value="card-wish"
                                        ></input>
                                        <label
                                            className={`ml-[5px]`}
                                            htmlFor="cardSelect">
                                            Speciaal wenskaartje
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`flex flex-col sm:w-[80%] w-[100%] justify-between mt-[45px]`}
                            >
                                <label htmlFor="employee">Aangenomen door:</label>
                                <select required
                                    className={`border-[1px] border-black w-[100%] h-[30px]`}
                                    name="employee"
                                    id="employee">
                                    {findAllEmployees.map(f => {
                                        return <option value={f.id}>{f.name}</option>
                                    })}
                                </select>
                            </div>
                            <div
                                className={`flex sm:flex-row flex-col sm:ml-[0px] ml-[10%] justify-between mt-[85px] w-[82%]`}
                            >
                                <button onClick={
                                    async () => {

                                        let order = await addOrder(1, 1, 1, "01-21-2023", 1.23, "PIN",
                                            "extratest", "infotest", "messagetest", "IN_PROGRESS", false,
                                            "SPECIAL_CARD")
                                        if (order.error) {
                                            alert(order.error.message);
                                        }
                                    }
                                }>test
                                </button>
                                <input className={`text-sm border-[1px] h-full py-[8px] px-[20px] font-['Roboto'] 
        bg-[#00A952] text-white font-bold border-[#45a049] rounded-lg hover:bg-[#45a049]`}
                                       value="Order toevoegen" type="button" onClick={
                                    async () => {
                                        await handleFormSubmit(findAllCustomers);
                                    }
                                }></input>
                                <WhiteButton link="/">Annuleren</WhiteButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
