// "use client";

// import { useState } from "react";
// import LabeledInput from "@/components/design/labeled-input";
// import { FileUploader } from "react-drag-drop-files";

// export default function NewMetadataModal({
//   index,
//   setLayerName,
//   setLayerFiles,
//   setLayerToDelete
// }) {
//   const [layerName, setLayerName] = useState("");
//   const [layerNameError, setLayerNameError] = useState(false);
//   const [imageTypeError, setImageTypeError] = useState(-1);
//   const [imageSizeError, setImageSizeError] = useState(-1);

//   const onChangeLayerName = (e) => {
//     setLayerName(e.target.value);
//     if (e.target.value.length > 32) setLayerNameError(true);
//     else {
//       if (layerNameError) setLayerNameError(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full bg-tock-black rounded-2xl">
//       <div className="mb-6">
//         <div className="flex flex-row">
//           <label className="block text-tock-orange text-sm font-bold mb-2">
//             <span className="text-zinc-400">{index}: </span> {layer}
//           </label>

//           <div className="flex grow justify-end">
//             <button
//               type="button"
//               onClick={() => setLayerToDelete(layer)}
//               className="mb-2 mx-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
//             >
//               remove layer
//             </button>
//           </div>
//         </div>
//         <LabeledInput
//           id="layer-name"
//           value={layerName}
//           type="text"
//           placeholder="background"
//           onChange={onChangeLayerName}
//           required={true}
//         >
//           layer name{" "}
//           <span className="text-sm font-normal text-zinc-400">(required)</span>
//         </LabeledInput>
//         {layerNameError && (
//           <p className="text-tock-red text-xs mt-2">
//             Layer names must be less than 32 charcters.
//           </p>
//         )}
//       </div>
//       <div className="mb-10">
//         <FileUploader
//           handleChange={(file) => handleLayerFileUpload(file, layer)}
//           name="file"
//           maxSize={0.3}
//           onSizeError={() => setImageSizeError(i)}
//           onTypeError={() => setImageTypeError(i)}
//           types={projectImageFileTypes}
//           hoverTitle="Drop"
//           multiple
//           children={
//             <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
//               <span className="mt-2">drop files here</span>
//             </div>
//           }
//           dropMessageStyle={{
//             backgroundColor: "grey",
//             color: "white",
//             border: "1px dashed white",
//             borderRadius: "12px",
//           }}
//         />
//         {imageSizeError == i && (
//           <p className="text-tock-red mt-2 text-xs">
//             max allowed file size is 300kb
//           </p>
//         )}
//         {imageTypeError == i && (
//           <p className="text-tock-red mt-2 text-xs">only .png supported</p>
//         )}
//       </div>{" "}
//       <div className="mb-10">
//         <FileUploader
//           handleChange={(file) => handleLayerFileUpload(file, layer)}
//           name="file"
//           maxSize={0.3}
//           onSizeError={() => setImageSizeError(i)}
//           onTypeError={() => setImageTypeError(i)}
//           types={projectImageFileTypes}
//           hoverTitle="Drop"
//           multiple
//           children={
//             <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
//               <span className="mt-2">drop files here</span>
//             </div>
//           }
//           dropMessageStyle={{
//             backgroundColor: "grey",
//             color: "white",
//             border: "1px dashed white",
//             borderRadius: "12px",
//           }}
//         />
//         {imageSizeError == i && (
//           <p className="text-tock-red mt-2 text-xs">
//             max allowed file size is 300kb
//           </p>
//         )}
//         {imageTypeError == i && (
//           <p className="text-tock-red mt-2 text-xs">only .png supported</p>
//         )}
//       </div>
//     </div>
//   );
// }
