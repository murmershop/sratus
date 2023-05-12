import { FC, useEffect, useState } from "react";
import { Select, PLACEHOLDER_VALUE } from "../components/Select";

const fetchAPI = async (paths: string[]) =>
  fetch(`./api/${paths.join("/")}.json`)
    .then((response) => response.json())
    .then((data) =>
      data
        .map(({ id: value, name: label, ...item }) => ({
          label,
          value: +value,
          ...item,
        }))
        .sort((a, z) => a.label.localeCompare(z.label))
    );

export const Form: FC = () => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVilages] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] =
    useState<string>(PLACEHOLDER_VALUE);
  // const selectedProvince = provinces.find(item => item.value === selectedProvinceId)

  const [selectedRegencyId, setSelectedRegencyId] =
    useState<string>(PLACEHOLDER_VALUE);
  // const selectedRegency = regencies.find(item => item.value === selectedRegencyId)

  const [selectedDistrictId, setSelectedDistrictId] =
    useState<string>(PLACEHOLDER_VALUE);

  const [selectedVillageId, setSelectedVillageId] =
    useState<string>(PLACEHOLDER_VALUE);

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

  useEffect(() => {
    fetchAPI(["provinces"]).then(setProvinces);
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) return;
    fetchAPI(["regencies", selectedProvinceId]).then(setRegencies);
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedRegencyId) return;
    fetchAPI(["districts", selectedRegencyId]).then(setDistricts);
  }, [selectedRegencyId]);

  useEffect(() => {
    if (!selectedDistrictId) return;
    fetchAPI(["villages", selectedDistrictId]).then(setVilages);
  }, [selectedDistrictId]);

  console.log({ selectedDistrictId });

  return (
    <form className="flex flex-col gap-2">
      <h3 className="text-2xl text-center">ALAMAT PENGIRIMAN</h3>
      <Select
        id="provinsi"
        label="Pilih Provinsi"
        placeholder="Provinsi (berdasarkan abjad)"
        value={selectedProvinceId}
        options={provinces}
        onChange={handleChangeProvince}
      />

      <Select
        id="kabupaten"
        label="Pilih Kabupaten / Kota"
        placeholder="Kabupaten / Kota (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedProvinceId)}
        value={selectedRegencyId}
        options={regencies}
        onChange={handleChangeRegency}
      />

      <Select
        id="kecamatan"
        label="Pilih Kecamatan"
        placeholder="Kecamatan (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedRegencyId)}
        value={selectedDistrictId}
        options={districts}
        onChange={handleChangeDistrict}
      />

      <Select
        id="desa"
        label="Pilih Desa"
        placeholder="Desa (berdasarkan abjad)"
        disabled={[PLACEHOLDER_VALUE, "-2"].includes(selectedDistrictId)}
        value={selectedVillageId}
        options={villages}
        onChange={handleChangeVillage}
      />
    </form>
  );
};
