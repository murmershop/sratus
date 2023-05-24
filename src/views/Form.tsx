import { FC, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { shuffle } from "radash";
import {
  Select,
  PLACEHOLDER_VALUE,
  SEPARATOR_VALUE,
} from "../components/Select";
import { WA_API_URL, WA_NUMBERS } from "../constants/whatsapp";
import { MESSAGE_TEMPLATE } from "../constants/misc";
import { Input } from "../components/Input";
import { WhatsAppIcon } from "../svg/WhatsApp";
import { CheckoutIcon } from "../svg/Checkout";
import { AnalyticsEventNames } from "../constants/events";
import { fetchAPI } from "../utils/api";

enum LocationKeys {
  PROVINCE = "provinsi",
  REGENCY = "kabupaten",
  DISTRICT = "kecamatan",
  VILLAGE = "kelurahan",
}

export interface FormProps {
  productId: string;
  productFeature?: string;
  whatsappNumber?: string[];
  message?: string;
}

const isValidId = (id: string) =>
  ![PLACEHOLDER_VALUE, SEPARATOR_VALUE].includes(id);

const nanoid = (prefix: string) =>
  [prefix, customAlphabet("1234567890abcdef", 7)().toUpperCase()]
    .filter((item) => item)
    .join("-");

export const Form: FC<FormProps> = ({
  productId,
  productFeature = "produk ini",
  whatsappNumber,
  message,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVilages] = useState([]);
  const [orderId, setOrderId] = useState(nanoid(productId));

  const [selectedProvinceId, setSelectedProvinceId] =
    useState<string>(PLACEHOLDER_VALUE);
  const selectedProvince = provinces.find(
    (item) => item.value === selectedProvinceId
  );

  const [selectedRegencyId, setSelectedRegencyId] =
    useState<string>(PLACEHOLDER_VALUE);
  const selectedRegency = regencies.find(
    (item) => item.value === selectedRegencyId
  );

  const [selectedDistrictId, setSelectedDistrictId] =
    useState<string>(PLACEHOLDER_VALUE);
  const selectedDistrict = districts.find(
    (item) => item.value === selectedDistrictId
  );

  const [selectedVillageId, setSelectedVillageId] =
    useState<string>(PLACEHOLDER_VALUE);
  const selectedVillage = villages.find(
    (item) => item.value === selectedVillageId
  );

  const [name, setName] = useState<string>();

  const [additionalAddress, setAdditionalAddress] = useState<string>();

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

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleAdditionalAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setAdditionalAddress(event.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name) return alert("Mohon isi nama Anda");
    if (!selectedProvince) return;
    if (!selectedRegency) return;
    if (!selectedDistrict) return;
    if (!selectedVillage) return;

    const formData = new FormData(event.currentTarget);
    const rawData = [...formData.entries()].reduce((acc, [key, value]) => {
      switch (key) {
        case LocationKeys.PROVINCE:
          acc.push([key, selectedProvince]);
          break;

        case LocationKeys.REGENCY:
          acc.push([key, selectedRegency]);
          break;

        case LocationKeys.DISTRICT:
          acc.push([key, selectedDistrict]);
          break;

        case LocationKeys.VILLAGE:
          acc.push([key, selectedVillage]);
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
        const phoneNumber = shuffle(whatsappNumber || WA_NUMBERS);

        const alamat = [
          additionalAddress,
          selectedVillage.label,
          selectedDistrict.label,
          selectedRegency.label,
          selectedProvince.label,
        ]
          .filter((item) => item)
          .join(", ");

        const formattedMessage = (message || MESSAGE_TEMPLATE)
          .replace("$produk", productFeature)
          .replace("$nama", name.toUpperCase())
          .replace("$alamat", alamat)
          .replace("$orderId", orderId);

        const encodedMessage = encodeURIComponent(formattedMessage).replace(
          /%5Cn/g,
          "%0A"
        );

        if (import.meta.env.PROD) {
          (window as any).dataLayer.push({
            event: AnalyticsEventNames.ASKING_ONGKIR,
            provinsi: selectedProvince.label,
            kabupaten: selectedRegency.label,
            kecamatan: selectedDistrict.label,
            kelurahan: selectedVillage.label,
          });
        }

        window.location.href = `${WA_API_URL}?phone=${phoneNumber}&text=${encodedMessage}`;
      })
      .then(() => {
        randomizeOrderId();
        setSelectedProvinceId(PLACEHOLDER_VALUE);
        setSelectedRegencyId(PLACEHOLDER_VALUE);
        setSelectedDistrictId(PLACEHOLDER_VALUE);
        setSelectedVillageId(PLACEHOLDER_VALUE);
        setName("");
        setAdditionalAddress("");
      })
      .catch((error) => console.error(error));
  };

  //#region side-effects
  useEffect(() => {
    fetchAPI(["provinces"]).then(setProvinces);
  }, []);

  useEffect(() => {
    if (!isValidId(selectedProvinceId)) return;
    fetchAPI(["regencies", selectedProvinceId]).then((regenciesData) => {
      const { cities, regencies } = regenciesData.reduce(
        (acc, item) => {
          if (item.label.includes("KOTA")) {
            acc.cities.push(item);
          }

          if (item.label.includes("KABUPATEN")) {
            acc.regencies.push(item);
          }

          return acc;
        },
        { cities: [], regencies: [] }
      );

      setRegencies([...cities, ...regencies]);
    });
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!isValidId(selectedRegencyId)) return;
    fetchAPI(["districts", selectedRegencyId]).then((districts) =>
      setDistricts(
        districts.map((item) => ({
          ...item,
          label: `KECAMATAN ${item.label}`,
        }))
      )
    );
  }, [selectedRegencyId]);

  useEffect(() => {
    if (!isValidId(selectedDistrictId)) return;
    fetchAPI(["villages", selectedDistrictId]).then((villages) =>
      setVilages(
        villages.map((item) => ({
          ...item,
          label: `DESA ${item.label}`,
        }))
      )
    );
  }, [selectedDistrictId]);
  //#endregion

  return (
    <form
      name="order"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="flex flex-col gap-4 mx-auto max-w-lg lg:max-w-screen-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-black text-xl">
          <CheckoutIcon /> FORMULIR PEMESANAN (ORDER)
        </div>

        <div className="text-xs text-red-800">
          * PAKAI SISTEM{" "}
          <span className="font-bold underline">COD (CASH ON DELIVERY)</span> /
          BAYAR DITEMPAT.
        </div>

        <div className="text-xs text-red-800">
          * DIANTAR PERSIS sampai depan rumah Anda,{" "}
          <span className="font-bold underline">
            HARGA BELUM TERMASUK ONGKIR.
          </span>
        </div>

        <div className="text-xs">* ISI NAMA DAN ALAMAT LENGKAP PENERIMA</div>
      </div>

      <hr />

      <Input
        id="nama"
        label="Nama Lengkap Penerima"
        placeholder="contoh: Siti Nurjanah"
        value={name}
        onChange={handleChangeName}
      />

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

      <Input
        id="alamat-tambahan"
        label="Alamat tambahan (Desa/Dukuh, RT/RW, No. Rumah)"
        placeholder="contoh: Gg. Kelinci No. 34 A"
        disabled={
          !name ||
          !(
            isValidId(selectedProvinceId) &&
            isValidId(selectedRegencyId) &&
            isValidId(selectedDistrictId)
          )
        }
        value={additionalAddress}
        onChange={handleAdditionalAddress}
      />

      <input type="hidden" name="order-id" value={orderId} />
      <input type="hidden" name="form-name" value="order" />
      <button
        className="bg-green-700 text-white text-xl font-semibold rounded-lg mt-2 py-4 px-2 flex items-center justify-center gap-2 hover:bg-green-600 active:bg-green-600"
        type="submit"
      >
        <WhatsAppIcon />
        <span>PESAN! (Klik chat WhatsApp)</span>
      </button>
      <div className="text-sm text-center text-green-700">
        ❗️❗️ Setelah mengirim chat via WhatsApp, tunggu balasan dari kami
        untuk konfirmasi. ❗️❗️
      </div>
    </form>
  );
};
