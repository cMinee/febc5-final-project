export default function DeleteDialog({
    id,
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) {
  if (!isOpen) return null;
  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-4">{message}</p>
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn" onClick={onConfirm}>Confirm</button> <button className="btn" onClick={onClose}>Close</button>
            </form>
            </div>
        </div>
    </dialog>
  );
}