import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RU as RuIcon, US as UsIcon, CN as CnIcon } from "country-flag-icons/react/3x2";
import styles from "./LanguageSwitcher.module.scss";
import Button from "@/shared/ui/Button/Button";

type FlagIconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const RU = RuIcon as FlagIconType;
const US = UsIcon as FlagIconType;
const CN = CnIcon as FlagIconType;

interface ILangOption {
  code: string;
  label: string;
  FlagIcon: FlagIconType;
}

const LANGUAGES: ILangOption[] = [
  { code: "ru", label: "RU", FlagIcon: RU },
  { code: "en", label: "EN", FlagIcon: US },
  { code: "zh", label: "中文", FlagIcon: CN },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language;
  const currentLangData =
    LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      setSearchParams({ lang: lng });
      setIsOpen(false);
    });
  };

  return (
    <div className={styles.languageSwitcher}>
      <Button className={styles.currentLang}  variant="secondary" onClick={toggleDropdown}>
        <currentLangData.FlagIcon
          className={styles.flagIcon}
          aria-label={currentLangData.label}
          role="img"
        />
        <span>{currentLangData.label}</span>
      </Button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {LANGUAGES.map(({ code, label, FlagIcon }) => (
            <li
              key={code}
              className={styles.dropdownItem}
              onClick={() => changeLanguage(code)}
            >
              <FlagIcon
                className={styles.flagIcon}
                aria-label={label}
                role="img"
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};