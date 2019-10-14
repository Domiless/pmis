<template>
	<div class="tinymce">
		<!-- 富文本编辑组件 -->
		<editor id="tinymce" v-model="tinymceHtml" :init="init"></editor>
	</div>
</template>
 
<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/modern/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/imagetools";
export default {
	name: "tinymce",
	data() {
		return {
			tinymceHtml: "请输入内容",
			init: {
				language_url: "/static/tinymce/zh_CN.js",
				language: "zh_CN",
				skin_url: "/static/tinymce/skins/lightgray",
				height: 300,
				plugins:
					"link lists image code table colorpicker textcolor wordcount contextmenu",
				toolbar:
					"bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
				branding: false,
				images_upload_handler: (blobInfo, success, failure) => {
					this.handleImgUpload(blobInfo, success, failure);
				}
			}
		};
	},
	mounted() {
		tinymce.init({});
	},
	methods: {
		handleImgUpload(blobInfo, success, failure) {
			let formdata = new FormData();
			formdata.set("file", blobInfo.blob());
			this.$axios
				.post(this.global.apiImg, formdata)
				.then(res => {
					this.Axios(
						{
							url: "/fastdfs/getUrl",
							params: { fid: res.data.data },
							type: "get",
							option: { enableMsg: false },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								success(result.data.data);
							}
						},
						({ type, info }) => {}
					);
				})
				.catch(res => {
					failure("上传失败");
				});
		}
	},

	components: { Editor }
};
</script>