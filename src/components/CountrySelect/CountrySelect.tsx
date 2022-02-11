import useFetch from "use-http";
import ReactCountryFlag from "react-country-flag";
import style from "./CountrySelect.module.scss";
import { Select } from "../Select/Select";

const COUNTRY_URL =
  "https://gist.githubusercontent.com/rusty-key/659db3f4566df459bd59c8a53dc9f71f/raw/4127f9550ef063121c564025f6d27dceeb279623/counties.json";

export type Country = { label: string; value: string };

type Props = {
  country: Country["value"] | undefined;
  onChange: (country: Country) => void;
  className?: string;
};

export const CountrySelect = ({ country, onChange, className }: Props) => {
  const { data: countries = [] } = useFetch<Country[]>(
    COUNTRY_URL,
    { retries: 2 },
    []
  );

  const countriesObj = Object.fromEntries(countries.map((c) => [c.value, c]));

  return (
    <Select
      value={country ? countriesObj[country] : undefined}
      className={className}
      onChange={onChange}
      options={countries.map((c) => ({
        ...c,
        filterValue: c.label.toLowerCase(),
      }))}
      placeholder="Select Country"
      emptySearchMessage="No Countries Found"
      renderRow={(c: Country) => (
        <div className={style.labelOption}>
          <ReactCountryFlag countryCode={c.value.toUpperCase()} svg />
          <span className={style.labelText}>{c.label}</span>
        </div>
      )}
      optionHeight={26}
    />
  );
};
