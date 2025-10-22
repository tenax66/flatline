require 'liquid'

module Jekyll
  module SlugifyAuthorFilter
    def slugify_author(input)
      return '' if input.nil?
      input
        .to_s
        .strip
        .gsub(/[∀_・（）()\s　]+/, '-') # 半角スペース・全角スペース・記号をハイフンに置換
        .gsub(/-+/, '-')           # 連続するハイフンを1つに
        .gsub(/^-+|-+$/, '')       # 先頭・末尾のハイフンを削除
        .downcase                  # 小文字化（必要なければ削除）
    end
  end
end

Liquid::Template.register_filter(Jekyll::SlugifyAuthorFilter)
