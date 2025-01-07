export interface IAcceleratorMetronome {
    accelerator: Accelerator;
    acceleratorEnabled: boolean;

    toggleAccelerator:() => void;
    setAccelerator:(accelerator: Accelerator) => void;
}