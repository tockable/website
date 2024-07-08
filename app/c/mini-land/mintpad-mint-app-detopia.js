import { useState, useEffect, useRef, useContext } from "react";
import { imageUrlFromBlob } from "@/utils/image-utils";
import { toHex32 } from "@/utils/crypto-utils";
import { MintContextTockable } from "@/contexts/mint-context-tockable";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

const cubeColorsNormal = [
  "bg-none",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-gray-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-yellow-500",
];

const groupAmount = 9;
export default function MintpadDappDetopia({ layers, fileNames, lands }) {
  // Contexts & Hooks
  const { addToBasket } = useContext(MintContextTockable);
  // States
  const [loaded, setLoaded] = useState(false);
  const [built, setBuilt] = useState(false);
  const [assets, setAssets] = useState([]);
  const [drawing, setDrawing] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [duplicated, setDuplicated] = useState(false);
  const [group, setGroup] = useState(0);
  const [baseBos, setBasePos] = useState({ x: 0, y: 0 });
  const [landInd, setLandind] = useState(0);
  const [landImages, setLands] = useState([]);
  const [bgind, setbgind] = useState(0);
  // const [bg, ssetBg] = useState([]);
  // Refs
  const ctx = useRef(null);
  const canvas = useRef(null);
  const loadedCount = useRef(0);

  const bgs = [
    "hsl(0, 100%, 50%)",
    "hsl(40, 100%, 50%)",
    "hsl(70, 100%, 50%)",
    "hsl(120, 100%, 50%)",
    "hsl(200, 100%, 50%)",
    "hsl(260, 100%, 50%)",
    "hsl(300, 100%, 50%)",
  ];

  const nextLand = () => {
    if (landInd == lands.length - 1) {
      setLandind(0);
    } else {
      setLandind(landInd + 1);
    }
    setDrawing(drawing);
  };

  const prevLand = () => {
    if (landInd > 0) {
      setLandind(landInd - 1);
    } else {
      setLandind(lands.length - 1);
    }
  };

  const nextBg = () => {
    if (bgind == bgs.length - 1) {
      setbgind(0);
    } else {
      setbgind(bgind + 1);
    }
  };

  const prevBg = () => {
    if (bgind > 0) {
      setbgind(bgind - 1);
    } else {
      setbgind(bgs.length - 1);
    }
    setDrawing(drawing);
  };

  // Effects
  useEffect(() => {
    if (fileNames.length == 0) return;
    let len = 0;
    for (let i in fileNames) len = len + fileNames[i].length;
    setTotalCount(len + lands.length);
  }, [fileNames]);

  useEffect(() => {
    if (totalCount == 0) return;

    const _assets = [];

    for (let i = 0; i < fileNames.length; i++) {
      const images = [];
      const layerFileNames = fileNames[i];

      for (let j = 0; j < layerFileNames.length; j++) {
        let img = new Image();

        img.crossOrigin = "anonymous";
        img.onload = () => {
          imageLoaded();
        };

        img.src = `/miniland/${layerFileNames[j]}`;
        images.push({ img, name: layerFileNames[j] });
      }

      _assets[i] = images;
    }

    const _lands = [];
    for (let i = 0; i < lands.length; i++) {
      let img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageLoaded();
        if (canvasHeight === 0 || canvasWidth === 0) {
          setCanvasWidth(img.naturalWidth / 4);
          setCanvasHeight(img.naturalHeight / 4);
        }
      };
      img.src = `/miniland/${lands[i]}`;
      _lands.push({ img, name: lands[i] });
    }

    setLands(_lands);
    setAssets(_assets);
  }, [totalCount]);

  useEffect(() => {
    if (!built) return;
    redraw();
  }, [drawing, built, landInd, bgind]);

  useEffect(() => {
    if (!loaded) return;
    if (canvasHeight === 0 || canvasWidth === 0) return;
    if (canvas.current) return;
    let _canvas = document.getElementById("app-canvas");
    canvas.current = _canvas;
    ctx.current = _canvas.getContext("2d");
    let newDrawing = {};

    for (let g = 0; g < groupAmount; g++) {
      newDrawing[g] = {};
      for (let layer in assets) {
        if (layer == 0) {
          newDrawing[g][layer] =
            Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 8);
        } else {
          newDrawing[g][layer] = 0;
        }
      }
    }

    setDrawing(newDrawing);
    setBuilt(true);
  }, [loaded, canvasHeight, canvasWidth, assets, lands]);

  useEffect(() => {
    if (canvasWidth === 0 || canvasHeight === 0) return;
    if (!canvas.current) return;
    canvas.current.width = canvasWidth;
    canvas.current.height = canvasHeight;
    const x = ((-1 * canvasWidth) / 6.67) * Math.cos(Math.PI / 4);
    const y = ((-1 * canvasWidth) / 11.32) * Math.sin(Math.PI / 4);
    setBasePos({ x, y });
  }, [canvasHeight, canvasWidth]);

  // Functions
  function redraw() {
    if (baseBos.x === 0) return;
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

    ctx.current.fillStyle = bgs[bgind];
    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.width);

    ctx.current.drawImage(
      landImages[landInd].img,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );

    for (let g = 0; g < groupAmount; g++) {
      for (let layer in drawing[g]) drawImage(g, layer);
    }
  }

  function imageLoaded(e) {
    setPercentage(Math.ceil(((loadedCount.current + 1) * 100) / totalCount));
    loadedCount.current = loadedCount.current + 1;
    if (loadedCount.current === totalCount) setLoaded(true);
  }

  function drawImage(g, layer) {
    if (!built) return;

    const selectedLayer = assets[layer];
    if (selectedLayer[drawing[g][layer]].name === "/test/empty.png") return;

    const baseIndex = g;
    const pos = Math.floor(baseIndex / 3);
    const level = baseIndex % 3;

    const x =
      baseBos.x + ((pos * canvas.current.width) / 6.67) * Math.cos(Math.PI / 4);
    const y =
      baseBos.y +
      ((pos * canvas.current.width) / 11.32) * Math.sin(Math.PI / 4) +
      (-level * canvas.current.width) / 8.11;

    ctx.current.drawImage(
      selectedLayer[drawing[g][layer]].img,
      x,
      y,
      canvas.current.width,
      canvas.current.height
    );
  }

  function nextImg(layer) {
    const selectedLayer = assets[layer];
    const newDrawing = JSON.parse(JSON.stringify(drawing));
    if (drawing[group][layer] + 1 < selectedLayer.length) {
      newDrawing[group][layer] = drawing[group][layer] + 1;
    } else {
      newDrawing[group][layer] = 0;
    }
    setDrawing(newDrawing);
  }

  function prevImg(layer) {
    const newDrawing = JSON.parse(JSON.stringify(drawing));
    const selectedLayer = assets[layer];
    if (drawing[group][layer] - 1 >= 0) {
      newDrawing[group][layer] = drawing[group][layer] - 1;
    } else {
      newDrawing[group][layer] = selectedLayer.length - 1;
    }
    setDrawing(newDrawing);
  }

  function addTokenToBasket() {
    const traits = [];

    const landName = lands[landInd];
    const landValue = toHex32(landName.slice(0, -4));

    const bgName = bgs[bgind];
    const bgValue = toHex32(bgName);

    traits.push(bgValue);
    traits.push(landValue);

    for (let g = 0; g < groupAmount; g++) {
      for (let i = 0; i < layers.length; i++) {
        const selectedLayer = assets[i];
        const _name = selectedLayer[drawing[g][i]].name;
        const value = toHex32(_name.slice(0, -4) + "-" + g);

        traits.push(value);
      }
    }

    canvas.current.toBlob((blob) => {
      const url = imageUrlFromBlob(blob);
      const res = addToBasket({ blob, url, traits });
      if (res.duplicated) {
        setDuplicated(true);
      } else {
        setDuplicated(false);
      }
    });
  }

  return (
    <div>
      {!loaded && (
        <div>
          <p className="text-center text-tock-green mb-2 text-xs font-normal">
            please wait for app to build...
          </p>
          <p className="text-center text-tock-green mb-2 text-xs font-normal">
            {percentage}%
          </p>
          <div className="flex justify-center items-center">
            <Loading isLoading={!loaded} size={20} />
          </div>
        </div>
      )}
      {loaded && (
        <div>
          <h1 className="p-8 text-center lg:text-start font-bold text-tock-green text-2xl">
            design your NFT
          </h1>
          <div className="flex flex-col items-center lg:flex-row-reverse justify-center w-full">
            <div className="flex flex-col justify-center">
              {/* {canvasWidth > 0 && canvasHeight > 0 && ( */}
              <canvas
                id="app-canvas"
                className="rounded-xl mt-4 border border-zinc-500 mb-2 w-[350px] h-[350px] object-contain"
                width={canvasWidth}
                height={canvasHeight}
              ></canvas>
              {/* )} */}
              <div className="flex flex-col justify-center mt-4 ml-0 md:mr-4 lg:mr-0">
                <div className="flex justify-center items-center">
                  <Button variant="primary" onClick={addTokenToBasket}>
                    + Add to basket (pre-mint)
                  </Button>
                </div>

                {duplicated && (
                  <p className="flex justify-center text-tock-red text-xs mt-4">
                    Cannot mint duplicated token in this collection
                  </p>
                )}
              </div>
            </div>
            {built && (
              <div className="mb-6 mt-2 px-10">
                {
                  <>
                    <div className="mt-6 mb-4 flex flex-col sm:grid sm:grid-cols-2 items-center justify-center">
                      <div className="min-w-max md:w-64 text-sm text-zinc-400 text-start flex flex-col">
                        <p className="text-tock-orange text-center sm:text-start">
                          Land:
                        </p>{" "}
                        <p className="text-center sm:text-start">
                          {landImages[landInd].name.slice(0, -4)}
                        </p>
                      </div>
                      <div className="flex justify-center select-none">
                        <button
                          className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                          onClick={prevLand}
                        >
                          &lt;
                        </button>

                        <p className="text-zinc-500 text-xs w-12 text-center align-middle mt-4">
                          {landInd + 1}/{lands.length}
                        </p>
                        <button
                          className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                          onClick={nextLand}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 mb-4 flex flex-col sm:grid sm:grid-cols-2 items-center justify-center">
                      <div className="min-w-max md:w-64 text-sm text-zinc-400 text-start flex flex-col">
                        <p className="text-tock-orange text-center sm:text-start">
                          Land:
                        </p>{" "}
                        <p className="text-center sm:text-start">
                          {`bg-${bgind + 1}`}
                        </p>
                      </div>
                      <div className="flex justify-center select-none">
                        <button
                          className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                          onClick={prevBg}
                        >
                          &lt;
                        </button>

                        <p className="text-zinc-500 text-xs w-12 text-center align-middle mt-4">
                          {bgind + 1}/{bgs.length}
                        </p>
                        <button
                          className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                          onClick={nextBg}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-start h-full mt-10">
                      <div className="w-full flex-auto text-center sm:text-start flex items-center justify-center mb-2 md:justify-start">
                        <p className="text-tock-orange">select block</p>
                      </div>

                      <div className="flex gap-2 pr-0 md:pr-20 mr-0 justify-center sm:justify-end sm:mr-14 md:mr-0 mb-10 h-full">
                        {[
                          [0, 1, 2],
                          [3, 4, 5],
                          [6, 7, 8],
                        ].map((col, j) => (
                          <div
                            key={"col_" + j}
                            className="flex flex-col-reverse gap-2"
                          >
                            {col.map((b, i) => (
                              <div
                                key={"block_" + i}
                                className={`w-6 h-6 rounded-md border-[1px] flex justify-center itmes-center ${
                                  b === group
                                    ? cubeColorsNormal[drawing[b][0]] +
                                      " " +
                                      "border-[4px] border-zinc-200"
                                    : `${
                                        cubeColorsNormal[drawing[b][0]]
                                      } hover:bg-opacity-50 hover:border-zinc-400 transition duration-200 border-zinc-600`
                                }`}
                                onClick={() => setGroup(b)}
                              >
                                {" "}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    {Object.keys(drawing[group]).map((layer, i) => {
                      return (
                        <div
                          key={"drawing_" + i}
                          className="mt-6 mb-4 flex flex-col sm:grid sm:grid-cols-2 items-center justify-center"
                        >
                          <div className="min-w-max md:w-64 text-sm text-zinc-400 text-start flex flex-col">
                            <p className="text-tock-orange text-center sm:text-start">
                              {layers[layer]}:
                            </p>{" "}
                            <p className="text-center sm:text-start">
                              {assets[layer][drawing[group][layer]].name.slice(
                                0,
                                -4
                              )}
                            </p>
                          </div>
                          <div className="flex justify-center select-none">
                            <button
                              className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                              onClick={() => prevImg(layer)}
                            >
                              &lt;
                            </button>

                            <p className="text-zinc-500 text-xs w-12 text-center align-middle mt-4">
                              {drawing[group][layer] + 1}/{assets[layer].length}
                            </p>
                            <button
                              className="disabled:border-zinc-700 disabled:text-zinc-700 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                              onClick={() => nextImg(layer)}
                            >
                              &gt;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
