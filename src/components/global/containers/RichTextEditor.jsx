import { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@components/global/containers/RichTextEditor.css";

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: props.value || "" };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) this.setState({ editorHtml: this.props.value });
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
    this.props.onChange(html);
  }

  render() {
    return (
      <ReactQuill
        value={this.state.editorHtml}
        onChange={this.handleChange}
        modules={RichTextEditor.modules}
        formats={RichTextEditor.formats}
        bounds={".app"}
        placeholder={this.props.placeholder}
      />
    );
  }
}

RichTextEditor.modules = {
  toolbar: [
    [{ header: "2" }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

RichTextEditor.formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export default RichTextEditor;
