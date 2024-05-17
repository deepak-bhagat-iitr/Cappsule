






















import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function CapsuleWebDevelopmentTest() {
  const [input, setInput] = useState("");
  const [displayText, setDisplayText] = useState('');
  const [medicineInfo, setMedicineInfo] = useState([]);
  const [cards, setCards] = useState(false);
  const [activeButtonIndexForm, setActiveButtonIndexForm] = useState(0);
  const [activeButtonIndexStrength, setActiveButtonIndexStrength] = useState(0);
  const [activeButtonIndexPackage, setActiveButtonIndexPackage] = useState(0);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const [strength, setStrength] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [strengthObject, setStrengthObject] = useState({})
  const [packageValues, setPackageValues] = useState(null);
  const [packageObject, setPackageObject] = useState({});
  const [available, setAvailable] = useState(false);
  const [price, setPrice] = useState([]);
  const [isOverflowingForm, setIsOverflowingForm] = useState(false);
  const [isOverflowingStrength, setIsOverflowingStrength] = useState(false);
  const [isOverflowingPackage, setIsOverflowingPackage] = useState(false);
  const formRef = useRef(null);
  const strengthRef = useRef(null);
  const packageRef = useRef(null);
  const [name, setName] = useState();
  const [weight, setWeight] = useState();
  const [dose, setDose] = useState();




  const checkFormOverflow = () => {
    const fl = formRef.current;
    if (fl) {
      setIsOverflowingForm(fl.scrollHeight > fl.clientHeight || fl.scrollWidth > fl.clientWidth);
    }
  };

  const checkStrengthOverflow = () => {
    const sl = strengthRef.current;
    if (sl) {
      setIsOverflowingStrength(sl.scrollHeight > sl.clientHeight || sl.scrollWidth > sl.clientWidth);
    }
  };

  const checkPackageOverflow = () => {
    const pl = packageRef.current;
    if (pl) {
      setIsOverflowingPackage(pl.scrollHeight > pl.clientHeight || pl.scrollWidth > pl.clientWidth);
    }
  };



  useEffect(() => {
    axios.get("https://backend.cappsule.co.in/api/v1/new_search?q=paracetamol&pharmacyIds=1,2,3")
      .then((response) => {
        setMedicineInfo(response.data.data.saltSuggestions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    checkFormOverflow();
    checkStrengthOverflow();
    checkPackageOverflow();


  }, [filteredMedicine]);


  function search(e) {
    e.preventDefault();

    setDisplayText(input);
    setActiveButtonIndexForm(0)
    setActiveButtonIndexStrength(0)
    setActiveButtonIndexPackage(0)



    const filtered = medicineInfo.filter(medicine =>
      medicine.salt.toLowerCase().includes(input.toLowerCase())
    );
    if (filtered.length > 0) {
      setFilteredMedicine(filtered);
      setCards(true);

      const keys = (filtered[0].available_forms);
      const keys_mass = Object.keys(filtered[0].salt_forms_json[keys[0]]);
      setWeight(keys_mass[0])
      setStrength(keys_mass)
      setStrengthObject(filtered[0].salt_forms_json[keys[0]])
      const keys_package = Object.keys(filtered[0].salt_forms_json[keys[0]]);
      let y = (Object.keys(filtered[0].salt_forms_json[keys[0]][keys_package[0]]));
      setDose(y[0])
      setPackageObject(filtered[0].salt_forms_json[keys[0]][keys_package[0]]);
      setPackageValues(Object.keys(filtered[0].salt_forms_json[keys[0]][keys_package[0]]))
      setName(keys[0])
      const valuesArray = Object.values((filtered[0].salt_forms_json[keys[0]][keys_package[0]])[(y[0])]); // Get values of the object at key 'e'

      const isFullyNull = valuesArray.every(x => x === null);
      setAvailable(isFullyNull);
      checkFormOverflow();
      checkStrengthOverflow();
      checkPackageOverflow();
      if (isFullyNull) {
        setPrice(
          [[{
            "pharmacy_id": 3,
            "selling_price": (<div className="message-box">
              No stores selling this product near you
            </div>)
          }]])
      }
      else {

        let x = []
        valuesArray.forEach(value => {
          if (value !== null) {
            x.push(value);
          }
        });
        setPrice(x)

      }
    } else {
      alert("No Medicine Found");
    }


  }



  const handleFormClick = (index, e) => {

    setIsExpanded(false)
    setIsSpread(false)
    setName(e)
    setActiveButtonIndexForm(index);
    setActiveButtonIndexStrength(0)

    setStrengthObject(filteredMedicine[0].salt_forms_json[e]);
    const strength_keys = Object.keys(filteredMedicine[0].salt_forms_json[e]);
    setStrength(strength_keys);
    const object = strength_keys[0];

    const x = filteredMedicine[0].salt_forms_json[e];

    if (x.hasOwnProperty(object)) {
      const package_keys = Object.keys(x[object]);
      setPackageValues(package_keys)

    }

  };

  const handleStrengthClick = (position, e) => {
    setActiveButtonIndexStrength(position);
    setActiveButtonIndexPackage(0)
    setWeight(e)

    setIsSpread(false)


    const packaging_keys = Object.keys(strengthObject);

    const index = packaging_keys.indexOf(e);


    const valuesArray = Object.values(strengthObject);
    setPackageObject(valuesArray[index]);

    const package_values = Object.keys(valuesArray[index]);
    setPackageValues(Object.keys(valuesArray[index]));
    setDose(package_values[0])
    const Array = Object.values(strengthObject[e]); // Get values of the object at key 'e'
    const values = Object.values(Array[0]);
    setPrice(values)


    const isFullyNull = values.every(x => x === null); // Check if all values are null
    setAvailable(isFullyNull); // Set availability state

    if (isFullyNull) {
      setPrice(
        [[{
          "pharmacy_id": 3,
          "selling_price": (<div className="message-box">
            No stores selling this product near you
          </div>)
        }]])
    }
    else {

      let x = []
      values.forEach(val => {
        if (val !== null) {
          x.push(val);
        }
      });
      setPrice(x)
    }




  };
  const handlePackagingClick = (position, e) => {
    setDose(e)
    setActiveButtonIndexPackage(position);

    if (packageObject && packageObject.hasOwnProperty(e)) {

      const valuesArray = Object.values(packageObject[e]);

      const isFullyNull = valuesArray.every(x => x === null);
      setAvailable(isFullyNull);

      if (isFullyNull) {
        setPrice(
          [[{
            "pharmacy_id": 3,
            "selling_price": (<div className="message-box">
              No stores selling this product near you
            </div>)
          }]])
      }
      else {

        let x = []
        valuesArray.forEach(value => {
          if (value !== null) {
            x.push(value);
          }
        });
        setPrice(x)
      }
    }
  };
  const capitalizeFirstLetter = string => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };



  return (
    <>
      <header>
        <p>Cappsule web development</p>
      </header>
      <main>
        <div className="search_container">
          <form onSubmit={search}>
            <div className="search-box">
              <FontAwesomeIcon onClick={search} className="magnifying-glass-icon" icon={faMagnifyingGlass} />
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your medicine name here" />
              <button type="submit">Search</button>
            </div>
          </form>
          <hr />
        </div>
        {cards ? (
          <main className="medicine_container">
            {price.map((value, index) => (
              value.map((x, index) => (
                <div className="medicine" key={index}>
                  <div className="medicine_info">
                    <div className="form">
                      <p>Form :</p>
                      <div ref={formRef} className={isFree ? 'info-form form-expanded' : 'info-form'}>
                        {filteredMedicine &&
                          filteredMedicine[0].available_forms.map((e, index) => (
                            <button
                              onClick={() => handleFormClick(index, e)}
                              key={index}
                              className={`glow-button form_button ${activeButtonIndexForm === index ? 'active' : ''}`}
                            >
                              {(e)}
                            </button>
                          ))}
                      </div>
                      {isOverflowingForm && (<div className="show-more" onClick={() => { setIsFree(!isFree) }}>
                        {isFree ? 'hide..' : 'more..'}
                      </div>)
                      }
                    </div>

                    <div className="strength">
                      <p className="strength_para">Strength :</p>
                      <div ref={strengthRef} className={isExpanded ? 'info-strength strength-expanded' : "info-strength"}>
                        {strength &&
                          strength.map((e, index) => (
                            <button
                              onClick={() => handleStrengthClick(index, e)}
                              key={index}
                              className={`glow-button strength_button ${activeButtonIndexStrength === index ? 'active' : ''}`}
                            >
                              {e}
                            </button>
                          ))}
                      </div>
                      {isOverflowingStrength && (
                        <div className="show-more" onClick={() => { setIsExpanded(!isExpanded) }}>
                          {isExpanded ? 'hide..' : 'more..'}
                        </div>
                      )}
                    </div>
                    <div className="packaging">
                      <p>Packaging :</p>
                      <div ref={packageRef} className={isSpread ? 'info-packaging package-expanded' : 'info-packaging'}>

                        {packageValues &&
                          packageValues.map((e, index) => (

                            <button
                              onClick={() => handlePackagingClick(index, e)}
                              key={index}
                              className={`glow-button package-button ${activeButtonIndexPackage === index ? 'active' : ''}`}
                            >
                              {(e)}
                            </button>
                          ))}
                      </div>
                      {isOverflowingPackage && (<div className="show-more" onClick={() => { setIsSpread(!isSpread) }}>
                        {isSpread ? 'hide..' : 'more..'}
                      </div>)
                      }


                    </div>
                  </div>
                  <div className="medicine-details">
                    <h4>{capitalizeFirstLetter(displayText)}</h4>
                    <div className="medicine-item">
                      <p>{name} | {weight} | {dose}</p>
                    </div>
                  </div>
                  <div className="price">
                    {available ?
                      <div className="message-box">
                        No stores selling this product near you
                      </div>
                      :
                      (

                        <h2 key={index}>From ₹ {x["selling_price"]}</h2>
                      )
                    }
                  </div>

                </div>
              ))
            ))}
          </main>
        ) : (
          <div className="content">

            <q> Find medicines with amazing discounts </q>
          </div>
        )}
      </main>
    </>
  );
}

export default CapsuleWebDevelopmentTest;