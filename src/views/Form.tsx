import { FC, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import {
  Select,
  PLACEHOLDER_VALUE,
  SEPARATOR_VALUE,
} from "../components/Select";
import { API_URL } from "../constants/api";

const isValidId = (path: string) =>
  ![PLACEHOLDER_VALUE, SEPARATOR_VALUE].includes(path);

const nanoid = (prefix: string) =>
  [prefix, customAlphabet("1234567890abcdef", 7)().toUpperCase()]
    .filter((item) => item)
    .join("-");
const fetchAPI = async (paths: string[]) =>
  fetch(`${API_URL}${paths.join("/")}.json`)
    .then((response) => response.json())
    .then((data) =>
      data
        .map(({ id: value, name: label, ...item }) => ({
          label,
          value,
          ...item,
        }))
        .sort((a, z) => a.label.localeCompare(z.label))
    );

enum LocationKeys {
  PROVINCE = "provinsi",
  REGENCY = "kabupaten",
  DISTRICT = "kecamatan",
  VILLAGE = "kelurahan",
}

interface FormProps {
  productId: string;
}

export const Form: FC<FormProps> = ({ productId }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVilages] = useState([]);
  const [orderId, setOrderId] = useState(nanoid(productId));

  const [selectedProvinceId, setSelectedProvinceId] =
    useState<string>(PLACEHOLDER_VALUE);

  const [selectedRegencyId, setSelectedRegencyId] =
    useState<string>(PLACEHOLDER_VALUE);

  const [selectedDistrictId, setSelectedDistrictId] =
    useState<string>(PLACEHOLDER_VALUE);

  const [selectedVillageId, setSelectedVillageId] =
    useState<string>(PLACEHOLDER_VALUE);

  const randomizeOrderId = () => setOrderId(nanoid(productId));

  const handleChangeProvince = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProvinceId(event.target.value);
    setSelectedRegencyId(PLACEHOLDER_VALUE);
    setSelectedDistrictId(PLACEHOLDER_VALUE);
    setSelectedVillageId(PLACEHOLDER_VALUE);
  };

  const handleChangeRegency = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegencyId(event.target.value);
    setSelectedDistrictId(PLACEHOLDER_VALUE);
    setSelectedVillageId(PLACEHOLDER_VALUE);
  };

  const handleChangeDistrict = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDistrictId(event.target.value);
    setSelectedVillageId(PLACEHOLDER_VALUE);
  };

  const handleChangeVillage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedVillageId(event.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isValidId(selectedProvinceId)) return;
    if (!isValidId(selectedRegencyId)) return;
    if (!isValidId(selectedDistrictId)) return;
    if (!isValidId(selectedVillageId)) return;

    const formData = new FormData(event.currentTarget);
    const rawData = [...formData.entries()].reduce((acc, [key, value]) => {
      switch (key) {
        case LocationKeys.PROVINCE:
          acc.push([
            key,
            provinces.find((item) => item.value === selectedProvinceId),
          ]);
          break;

        case LocationKeys.REGENCY:
          acc.push([
            key,
            regencies.find((item) => item.value === selectedRegencyId),
          ]);
          break;

        case LocationKeys.DISTRICT:
          acc.push([
            key,
            districts.find((item) => item.value === selectedDistrictId),
          ]);
          break;

        case LocationKeys.VILLAGE:
          acc.push([
            key,
            villages.find((item) => item.value === selectedVillageId),
          ]);
          break;

        default:
          acc.push([key, value]);
      }

      return acc;
    }, []);

    const encodedData = rawData.map(([key, value]) => {
      if (
        [
          LocationKeys.PROVINCE,
          LocationKeys.REGENCY,
          LocationKeys.DISTRICT,
          LocationKeys.VILLAGE,
        ].includes(key)
      )
        return [key, JSON.stringify(value)];
      return [key, value];
    });

    const body = new URLSearchParams(
      Object.fromEntries(encodedData)
    ).toString();

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    })
      .then(() => {
        randomizeOrderId();
      })
      .catch((error) => console.error(error));
  };

  //#region side-effects
  useEffect(() => {
    fetchAPI(["provinces"]).then(setProvinces);
  }, []);

  useEffect(() => {
    if (!isValidId(selectedProvinceId)) return;
    fetchAPI(["regencies", selectedProvinceId]).then(setRegencies);
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!isValidId(selectedRegencyId)) return;
    fetchAPI(["districts", selectedRegencyId]).then(setDistricts);
  }, [selectedRegencyId]);

  useEffect(() => {
    if (!isValidId(selectedDistrictId)) return;
    fetchAPI(["villages", selectedDistrictId]).then(setVilages);
  }, [selectedDistrictId]);
  //#endregion

  console.log({ orderId });

  return (
    <form
      name="contact"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <h3 className="text-2xl text-center">ALAMAT PENGIRIMAN</h3>
      <Select
        id={LocationKeys.PROVINCE}
        label="Pilih Provinsi"
        placeholder="Provinsi (berdasarkan abjad)"
        value={selectedProvinceId}
        options={provinces}
        onChange={handleChangeProvince}
      />

      <Select
        id={LocationKeys.REGENCY}
        label="Pilih Kabupaten / Kota"
        placeholder="Kabupaten / Kota (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedProvinceId)}
        value={selectedRegencyId}
        options={regencies}
        onChange={handleChangeRegency}
      />

      <Select
        id={LocationKeys.DISTRICT}
        label="Pilih Kecamatan"
        placeholder="Kecamatan (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedRegencyId)}
        value={selectedDistrictId}
        options={districts}
        onChange={handleChangeDistrict}
      />

      <Select
        id={LocationKeys.VILLAGE}
        label="Pilih Kelurahan"
        placeholder="Kelurahan (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedDistrictId)}
        value={selectedVillageId}
        options={villages}
        onChange={handleChangeVillage}
      />

      <input type="hidden" name="order-id" value={orderId} />
      <input type="hidden" name="form-name" value="order" />
      <button type="submit">Testing</button>
    </form>
  );
};
