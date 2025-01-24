import { useState } from "react";
import { createRoot } from "react-dom/client";
import { QRCode } from "react-qrcode-logo";
import SweetAlert from "sweetalert2";

// Material UI
import { CardMedia, Box, IconButton, Icon } from "@mui/material";

import "@assets/css/alertsSwal.css";

const buttons = ({ confirm, deny, cancel }) => ({
  showConfirmButton: confirm ? true : false,
  showDenyButton: deny ? true : false,
  showCancelButton: cancel ? true : false,
  confirmButtonText: confirm ?? "Confirmar",
  denyButtonText: deny ?? "Denegar",
  cancelButtonText: cancel ?? "Cancelar",
});

const close = ({ disableClose }) => ({
  allowOutsideClick: !disableClose,
  allowEscapeKey: !disableClose,
  showCloseButton: true,
});

export const Swal = SweetAlert.mixin({
  customClass: { container: "modal-alert swal-scrollbar" },
  willOpen: (popup) => {
    if (!popup.querySelector(".swal2-title").textContent) Swal.clickCancel();
  },
});

export const SwalDelete = async ({ title, text, buttonText, onDelete }) => {
  const localOnDelete = onDelete ?? (() => {});

  SweetAlert.fire({
    title: title ?? "Eliminar",
    text: text ?? "¿Estas seguro de eliminar?",
    icon: "warning",
    showDenyButton: true,
    showCancelButton: true,
    showConfirmButton: false,
    focusDeny: true,
    denyButtonText: buttonText ?? "Eliminar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: { container: "modal-alert" },
  }).then((res) => {
    if (res.isDenied) localOnDelete();
  });
};

export const SwalImage = (props) => {
  const {
    id,
    image,
    title,
    confirm,
    cancel,
    deny,
    onConfirm,
    onDeny,
    className,
    sx,
    styles,
    containerStyles,
    disableClose,
  } = props;

  const localId = id ?? "my-swal-image-mtk";
  const localS = styles ?? {};
  const localCS = containerStyles ?? {};
  const localCF = onConfirm ?? (() => {});
  const localDN = onDeny ?? (() => {});

  SweetAlert.fire({
    html: `<div id="${localId}"></div>`,
    ...buttons({ confirm, deny, cancel }),
    ...close({ disableClose }),
    customClass: {
      container: "modal-alert swal-scrollbar",
      popup: `swal-content-image-mtk ${className ?? ""}`,
    },
    willOpen: (pop) => Object.keys(localS).forEach((key) => (pop.style[key] = localS[key])),
    didOpen: () => {
      const container = document.getElementById(localId);
      Object.keys(localCS).forEach((key) => (container.style[key] = localCS[key]));
      const root = createRoot(container);
      root.render(
        <CardMedia
          component="img"
          sx={{ overflow: "auto", px: 1, ...(sx ?? {}) }}
          image={image}
          alt={title ?? "Imagen representativa"}
        />
      );
    },
  }).then((res) => {
    if (res.isConfirmed) localCF();
    if (res.isDenied) localDN();
  });
};

export const SwalQR = (props) => {
  const {
    id,
    title,
    QR,
    confirm,
    cancel,
    deny,
    onConfirm,
    onDeny,
    sx,
    className,
    styles,
    containerStyles,
    disableClose,
  } = props;

  const localId = id ?? "my-swal-qr-mtk";
  const localS = styles ?? {};
  const localCS = containerStyles ?? {};
  const localCF = onConfirm ?? (() => {});
  const localDN = onDeny ?? (() => {});

  SweetAlert.fire({
    title: title ?? "",
    html: `<div id="${localId}"></div>`,
    ...buttons({ confirm, deny, cancel }),
    ...close({ disableClose }),
    customClass: { container: "modal-alert swal-scrollbar", popup: className ?? "" },
    willOpen: (pop) => Object.keys(localS).forEach((key) => (pop.style[key] = localS[key])),
    didOpen: () => {
      const container = document.getElementById(localId);
      Object.keys(localCS).forEach((key) => (container.style[key] = localCS[key]));
      const root = createRoot(container);
      root.render(<GetQR QR={QR ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} sx={sx ?? {}} />);
    },
  }).then((res) => {
    if (res.isConfirmed) localCF();
    if (res.isDenied) localDN();
  });
};

export const SwalComponent = (props) => {
  const {
    id,
    title,
    confirm,
    cancel,
    deny,
    onConfirm,
    onDeny,
    className,
    component,
    styles,
    containerStyles,
    disableClose,
  } = props;

  const localId = id ?? "my-swal-html-mtk";
  const localComponent = component ?? <></>;
  const localS = styles ?? {};
  const localCS = containerStyles ?? {};
  const localCF = onConfirm ?? (() => {});
  const localDN = onDeny ?? (() => {});

  SweetAlert.fire({
    title: title,
    html: `<div id="${localId}"></div>`,
    ...buttons({ confirm, deny, cancel }),
    ...close({ disableClose }),
    customClass: {
      container: "modal-alert swal-scrollbar",
      popup: `swal-content-html-mtk ${className ?? ""}`,
    },
    willOpen: (pop) => Object.keys(localS).forEach((key) => (pop.style[key] = localS[key])),
    didOpen: () => {
      const container = document.getElementById(localId);
      Object.keys(localCS).forEach((key) => (container.style[key] = localCS[key]));
      const root = createRoot(container);
      root.render(<>{localComponent}</>);
    },
  }).then((res) => {
    if (res.isConfirmed) localCF();
    if (res.isDenied) localDN();
  });
};

export const GetQR = ({ QR, sx = {}, disableButtons = false }) => {
  const [qrSize, setQrSize] = useState(200);
  const increaseSize = () => (qrSize < 400 ? setQrSize(qrSize + 50) : {});
  const decreaseSize = () => (qrSize > 200 ? setQrSize(qrSize - 50) : {});

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", ...sx }}
    >
      <QRCode value={QR} size={qrSize} />
      {!disableButtons && (
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <IconButton onClick={decreaseSize}>
            <Icon>remove</Icon>
          </IconButton>
          <IconButton onClick={increaseSize}>
            <Icon>add</Icon>
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
