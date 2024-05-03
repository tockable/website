"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FileUploader } from "react-drag-drop-files";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import { regex } from "@/constants/regex";
import { projectImageFileTypes } from "@/constants/constants";
import {
  updateProjectDetails,
  checkUniqueSlug,
} from "@/actions/launchpad/projects";
import { imageUrlFromBlob } from "@/utils/image-utils";
import { extractSlug } from "@/utils/string-utils";
import LabeledInput from "@/components/design/labeled-input";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import Fade from "@/components/design/fade/fade";
import storeFileToIpfs from "@/actions/ipfs/uploadFileToIpfs";

export default function ProjectDetailsForm({ params }) {
  const session = useSession();

  const [loadingFailed, setLoadingFailed] = useState(false);
  const [nameEditError, setNameEditError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showImage, setShowImage] = useState(false);
  const [imageToShow, setImageToShow] = useState();
  const [imageChanged, setImageChanged] = useState(false);
  const [imageSizeError, setImageSizeError] = useState(false);
  const [imageTypeError, setImageTypeError] = useState(false);
  const [mustImage, setMustImage] = useState(false);
  const [slugError, setSlugError] = useState(false);

  const [showCover, setShowCover] = useState(false);
  const [coverToShow, setCoverToShow] = useState();
  const [coverChanged, setCoverChanged] = useState(false);
  const [coverSizeError, setCoverSizeError] = useState(false);
  const [coverTypeError, setCoverTypeError] = useState(false);
  const [mustCover, setMustCover] = useState(false);

  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);

  const [lastState, setLastState] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      const res = await fetchProjectByUUID(
        session.data.user.address,
        params.projectId
      );

      if (res.success === true) {
        setProject(res.payload);
        setLastState(res.payload);
      }

      if (res.success === false) setLoadingFailed(true);
    })();
  }, [session]);

  useEffect(() => {
    if (!project) return;

    if (project.image) {
      setImageToShow(`https://${project.image}.${NFT_STORAGE_GATEWAY}`);
      setShowImage(true);
    }

    if (project.cover) {
      setCoverToShow(`https://${project.cover}.${NFT_STORAGE_GATEWAY}`);
      setShowCover(true);
    }
  }, [project]);

  useEffect(() => {
    if (!image) return;
    if (imageTypeError) setImageTypeError(false);
    if (imageSizeError) setImageSizeError(false);

    image.arrayBuffer().then((res) => {
      const blob = new Blob([res]);
      const url = imageUrlFromBlob(blob);
      setImageToShow(url);
      setShowImage(true);
    });
  }, [image]);

  useEffect(() => {
    if (!cover) return;
    if (coverTypeError) setCoverTypeError(false);
    if (coverSizeError) setCoverSizeError(false);

    cover.arrayBuffer().then((res) => {
      const blob = new Blob([res]);
      const url = imageUrlFromBlob(blob);
      setCoverToShow(url);
      setShowCover(true);
    });
  }, [cover]);

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  function clearImage() {
    if (!image && !imageToShow) return;

    setImageTypeError(false);
    setImageSizeError(false);

    if (project.image) setImageChanged(true);
    else setImageChanged(false);

    setImageToShow(null);
    setShowImage(false);
    setImage(null);
  }

  function clearCover() {
    if (!cover && !coverToShow) return;

    setCoverTypeError(false);
    setCoverSizeError(false);

    if (project.cover) setCoverChanged(true);
    else setCoverChanged(false);

    setCoverToShow(null);
    setShowCover(false);
    setCover(null);
  }

  function updateNeeded() {
    if (
      project.name != lastState.name ||
      project.description != lastState.description ||
      project.website != lastState.website ||
      project.twitter != lastState.twitter ||
      project.discord != lastState.discord ||
      project.slug != lastState.slug ||
      imageChanged ||
      coverChanged
    ) {
      return true;
    }
    return false;
  }

  const onImageUpload = (file) => {
    setImage(file);
    setImageChanged(true);
  };

  const onCoverUpload = (file) => {
    setCover(file);
    setCoverChanged(true);
  };

  const onChangeName = (e) => setProject({ ...project, name: e.target.value });

  const onChangeDescription = (e) =>
    setProject({ ...project, description: e.target.value });

  const onChangeTwitter = (e) => {
    if (e.target.value[e.target.value.length - 1] === "/") return;
    const slug = extractSlug(e.target.value);

    if (slug.match(regex.handle) || slug === "")
      setProject({ ...project, twitter: slug });
  };

  const onChangeDiscord = (e) => {
    if (e.target.value[e.target.value.length - 1] === "/") return;
    const slug = extractSlug(e.target.value);

    if (slug.match(regex.alphanumeric) || slug === "")
      setProject({ ...project, discord: slug });
  };

  function onChangeWebsite(e) {
    let slug = e.target.value;
    if (slug.match(regex.website) || slug === "")
      slug = slug.replace(/^https?:\/\/(?:www\.|(?!www))|^www\./, "");

    setProject({ ...project, website: slug });
  }

  const onChangeSlug = (e) => {
    if (e.target.value.match(regex.slug) || e.target.value === "")
      setProject({ ...project, slug: e.target.value });
  };

  async function prepareBuffer(_file) {
    const bytes = await _file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return { buffer, type: _file.type };
  }

  async function callUpdateProjectDetail() {
    setNameEditError(false);
    setSlugError(false);
    setSuccess(false);
    setFailed(false);
    setErrorMessage("");

    if (project.isDeployed && project.name !== lastState.name) {
      setNameEditError(true);
      return;
    }

    if (
      (!project.image ||
        project.image.length == 0 ||
        project.image == "null") &&
      !image
    ) {
      setMustImage(true);
      return;
    }

    if (
      (!project.cover ||
        project.cover.length == 0 ||
        project.cover == "null") &&
      !cover
    ) {
      setMustCover(true);
      return;
    }

    setSaving(true);

    if (project.slug !== lastState.slug) {
      const slugRes = await checkUniqueSlug(project.slug);

      if (slugRes.success === false) {
        setFailed(true);
        setErrorMessage("Something wrong in our side, please try again.");
        setSaving(false);
        return;
      }

      if (slugRes.duplicate === true) {
        setSlugError(true);
        setErrorMessage("Slug is taken, please choose another slug.");
        setSaving(false);
        return;
      }
    }

    let files;

    // if (imageChanged || coverChanged) {
    //   files = new FormData();
    //   if (imageChanged) files.append("image", image);
    //   if (coverChanged) files.append("cover", cover);
    // } else {
    //   files = null;
    // }

    let imageCid = project.image;
    let coverCid = project.cover;

    if (imageChanged) {
      const profileBuffer = await prepareBuffer(image);
      const profileRes = await storeFileToIpfs(
        profileBuffer.buffer,
        profileBuffer.type
      );

      if (profileRes.success === false) {
        setFailed(true);
        setSaving(false);
        setErrorMessage("Something wrong in our side, please try again.");
      }

      imageCid = profileRes.cid;
    }

    if (coverChanged) {
      const coverBuffer = await prepareBuffer(cover);
      const coverRes = await storeFileToIpfs(
        coverBuffer.buffer,
        coverBuffer.type
      );

      if (coverRes.success === false) {
        setFailed(true);
        setSaving(false);
        setErrorMessage("Something wrong in our side, please try again.");
      }

      coverCid = coverRes.cid;
    }

    const { uuid, name, description, website, twitter, discord, slug } =
      project;

    const params = {
      uuid,
      name,
      description,
      website,
      twitter,
      discord,
      slug,
      image: imageCid,
      cover: coverCid,
    };

    const res = await updateProjectDetails(
      session.data.user.address,
      params,
      files
    );

    if (res.success === false) {
      if (res.message === "forbidden") {
        setFailed(true);
        setErrorMessage("forbiden");
      } else if (res.message === "deployed") {
        setNameEditError(true);
      } else {
        setFailed(true);
        setErrorMessage("Something wrong in our side, please try again.");
      }
      setSaving(false);
      return;
    }

    setImageChanged(false);
    setCoverChanged(false);
    setProject(res.payload);
    setLastState(res.payload);
    setSuccess(true);
    setSaving(false);
  }

  return (
    <>
      {!project ? (
        <>
          {!loadingFailed ? (
            <div className="flex h-64 justify-center items-center">
              <Loading isLoading={!project} size={30} />
            </div>
          ) : (
            <Fade show={loadingFailed}>
              <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
                <p className="flex justify-center items-center h-24 text-sm text-tock-red">
                  Something wrong, please refresh the page. If the problem
                  persists, please try again in a few minutes...
                </p>
              </div>
            </Fade>
          )}
        </>
      ) : (
        <Fade show={project}>
          <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
            <form onKeyDown={noSubmit}>
              <h1 className="text-tock-green font-bold text-xl mb-6 ">
                details & description
              </h1>

              <div className="rounded-2xl bg-zinc-800 p-3 mb-4">
                <h1 className="text-zinc-500 font-bold text-md mb-8 pb-1">
                  general info
                </h1>
                <LabeledInput
                  value={project.name}
                  id="project-name"
                  type="text"
                  placeholder="Cool NFT"
                  onChange={onChangeName}
                  required={true}
                  disabled={project.isDeployed}
                  subtitle={
                    <div className="break-normal">
                      <p>-The title of the project for public display.</p>
                      <p>-Contract name will be generated using this field.</p>
                      <p className="text-tock-orange">
                        -Field cannot be edited after contract deployment
                      </p>
                    </div>
                  }
                >
                  Project name{" "}
                  <span className="text-xs font-normal text-zinc-500">
                    (required)
                  </span>
                </LabeledInput>

                <div>
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Project description{" "}
                    <span className="font-normal text-xs text-zinc-500">
                      {project.description ? project.description.length : "0"}
                      /500 chars
                    </span>
                  </label>
                  <textarea
                    value={project.description}
                    className="text-sm appearance-none resize-none h-28 bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                    id="project-description"
                    maxLength={500}
                    type="text"
                    placeholder="some cool description for project (up to 500 words)"
                    onChange={onChangeDescription}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-800 p-3 mt-8 mb-4">
                <h1 className="text-zinc-500 font-bold text-md mb-8 pb-1">
                  public social info
                </h1>
                <div className="mb-10">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Project website
                  </label>
                  <div className="flex">
                    <input
                      className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
                      value="https://"
                      readOnly
                      tabIndex="-1"
                    />
                    <input
                      className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
                      value={project.website}
                      id="project-website"
                      type="text"
                      placeholder="website.cool"
                      onChange={onChangeWebsite}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Twitter handle
                  </label>
                  <div className="flex">
                    <input
                      className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
                      value="twitter.com/"
                      readOnly
                      tabIndex="-1"
                    />
                    <input
                      className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
                      value={project.twitter}
                      id="project-twitter"
                      type="text"
                      placeholder="@cooltwitter"
                      onChange={onChangeTwitter}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Discord
                  </label>
                  <div className="flex">
                    <input
                      className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
                      value="discord.gg/"
                      readOnly
                      tabIndex="-1"
                    />
                    <input
                      className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
                      value={project.discord}
                      id="project-discord"
                      type="text"
                      placeholder="cooldiscord"
                      onChange={onChangeDiscord}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Tockable page{" "}
                    <span className="font-normal text-xs text-zinc-500">
                      (public mint page address)
                    </span>
                  </label>
                  <div className="flex">
                    <input
                      tabIndex="-1"
                      className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
                      value="tockable.xyz/c/"
                      readOnly
                    />
                    <input
                      className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
                      value={project.slug}
                      id="project-slug"
                      type="text"
                      placeholder="cool_slug"
                      onChange={onChangeSlug}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-800 p-3 mt-8 mb-4">
                <h1 className="text-zinc-500 font-bold text-md mb-8 pb-1">
                  project public images
                </h1>
                <div id="project-image-uploader">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Project image{" "}
                    <span className="text-zinc-500 text-xs font-normal">
                      (Ratio 1 : 1, 2MB max)
                    </span>
                  </label>
                  <div>
                    <FileUploader
                      name="file"
                      types={projectImageFileTypes}
                      maxSize={2}
                      onSizeError={() => setImageSizeError(true)}
                      onTypeError={() => setImageTypeError(true)}
                      hoverTitle="Drop"
                      handleChange={onImageUpload}
                      children={
                        <div className="bg-tock-semiblack border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                          <span className="mt-2">
                            Drag and drop, or just click in the box.
                          </span>
                        </div>
                      }
                      dropMessageStyle={{
                        backgroundColor: "grey",
                        color: "white",
                        border: "1px dashed white",
                        borderRadius: "12px",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={clearImage}
                    className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
                  >
                    Clear image
                  </button>

                  {imageSizeError && (
                    <p className="text-tock-red text-xs">
                      The file size should not exceed 2MB
                    </p>
                  )}

                  {imageTypeError && (
                    <p className="text-tock-red text-xs">
                      Supported file types: png, jpg, webp, gif
                    </p>
                  )}

                  {mustImage && (
                    <p className="text-tock-red text-xs">
                      please upload an image
                    </p>
                  )}

                  <div className="flex justify-center mt-2 mb-8">
                    {showImage && (
                      <img
                        className="rounded-xl"
                        src={imageToShow}
                        width="200"
                      ></img>
                    )}
                  </div>
                </div>
                <div id="project-cover-uploader" className="mt-10 mb-10">
                  <label className="block text-tock-blue text-sm font-bold mb-2">
                    Project cover image{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      (Ratio 4 : 1 landscape, 2MB max)
                    </span>
                  </label>
                  <div>
                    <FileUploader
                      handleChange={onCoverUpload}
                      name="file"
                      maxSize={2}
                      onSizeError={() => setCoverSizeError(true)}
                      onTypeError={() => setCoverTypeError(true)}
                      types={projectImageFileTypes}
                      hoverTitle="Drop"
                      children={
                        <div className="bg-tock-semiblack border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                          <span className="mt-2">
                            Drag and drop, or just click in the box.
                          </span>
                        </div>
                      }
                      dropMessageStyle={{
                        backgroundColor: "grey",
                        color: "white",
                        border: "1px dashed white",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearCover}
                    className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
                  >
                    Clear image
                  </button>

                  {coverSizeError && (
                    <p className="text-tock-red text-xs">
                      The file size should not exceed 2MB
                    </p>
                  )}

                  {coverTypeError && (
                    <p className="text-tock-red text-xs">
                      Supported file types: png, jpg, webp
                    </p>
                  )}

                  {mustCover && (
                    <p className="text-tock-red text-xs">
                      please upload a cover
                    </p>
                  )}
                  <div className="flex justify-center mt-2 mb-6">
                    {showCover && (
                      <img
                        className="rounded-xl"
                        src={coverToShow}
                        width="600"
                      ></img>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                type="button"
                disabled={saving || !updateNeeded()}
                onClick={() => {
                  callUpdateProjectDetail();
                }}
              >
                {saving ? (
                  <Loading isLoading={saving} size={10} />
                ) : (
                  <p>Save</p>
                )}
              </Button>

              {nameEditError && (
                <div className="mt-2 text-xs text-tock-red">
                  Project name cannot be edited after deployment
                </div>
              )}
              {success && !updateNeeded() && (
                <p className="mt-2 text-xs text-tock-green">
                  Project details successfully updated.
                </p>
              )}

              {failed && (
                <div className="mt-2 text-xs text-tock-red">{errorMessage}</div>
              )}

              {slugError && (
                <div className="mt-2 text-xs text-tock-red">
                  Slug is taken before, please choose another one.
                </div>
              )}
            </form>
          </div>
        </Fade>
      )}
    </>
  );
}
