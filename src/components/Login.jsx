import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    useDisclosure,
} from "@heroui/react";
import {useEffect, useState} from "react";

export default function Login() {
    const [isLoaded, setIsLoaded] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button onPress={onOpen} className={'login-btn'} disableRipple={true} disableAnimation={true}>Dashboard</Button>
            <Modal
                disableAnimation={true}
                isDismissable={false}
                backdrop="opaque"
                classNames={{
                    backdrop: `modal-bg ${isLoaded ? "loaded backdrop-blur-2xl" : ""} transition-all duration-500 ease-in-out`,
                    wrapper: `tw-app !w-full !max-w-full !h-full !max-h-full !m-0 !p-0 ${isLoaded ? "" : "translate-y-12 scale-75"} transition-transform duration-300 ease-in-out`,
                    base: `!w-full !max-w-full !h-full !max-h-full !m-0 !p-0 ${isLoaded ? "" : "opacity-0 blur"} transition-all duration-300 ease-in-out`,
                    body: '!block !w-full !max-w-full !h-full !max-h-full !m-0 !p-0'
                }}
                hideCloseButton={true}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => {
                        useEffect(() => {
                            window.addEventListener("message", function(event) {
                                if (event.data === "closeBtn") {
                                    setIsLoaded(false);
                                    setTimeout(() => onClose(), 1000)
                                }
                            });
                        }, []);

                        return (
                            <ModalBody>
                                <iframe src={'https://cms.crossrambles.com/dashboard/login/'} onLoad={() => setIsLoaded(true)} className={'block w-full h-full'} />
                            </ModalBody>
                        )
                    }}
                </ModalContent>
            </Modal>
        </>
    );
}
