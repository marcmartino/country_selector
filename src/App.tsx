import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import style from "./App.module.scss";
import {
  Country,
  CountrySelect,
} from "./components/CountrySelect/CountrySelect";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  return (
    <div className={style.App}>
      <CountrySelect
        country={selectedCountry?.value}
        onChange={setSelectedCountry}
      />
      {selectedCountry && (
        <div className={style.selectedCountryRow}>
          <ReactCountryFlag
            svg
            style={{ fontSize: 36, marginRight: 10 }}
            countryCode={selectedCountry.value.toUpperCase()}
          />
          <h2>{selectedCountry.label}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
