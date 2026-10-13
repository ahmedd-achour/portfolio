from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, sys
S=4; N=512*S
navy=(26,26,46); deep=(14,14,28); gold=(201,169,110); goldhi=(230,205,150)
# radial gradient background
bg=Image.new("RGB",(N,N))
px=bg.load()
cx,cy=N*0.35,N*0.28; maxd=math.hypot(N,N)*0.85
for y in range(N):
    for x in range(0,N):
        t=min(1,math.hypot(x-cx,y-cy)/maxd)
        px[x,y]=tuple(int(navy[i]*(1-t)+deep[i]*t+ (12 if i==2 else 6)*(1-t)) for i in range(3))
img=bg.convert("RGBA")
d=ImageDraw.Draw(img)
# thin gold ring
r=N*0.40; w=int(5*S)
d.ellipse([N/2-r,N/2-r,N/2+r,N/2+r],outline=gold+(110,),width=w)
# monogram
font=ImageFont.truetype("/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf",int(200*S))
txt="AA"
# gold vertical gradient text
mask=Image.new("L",(N,N),0); md=ImageDraw.Draw(mask)
bb=md.textbbox((0,0),txt,font=font,anchor="ls")
tw=bb[2]-bb[0]; th=bb[3]-bb[1]
x=(N-tw)/2-bb[0]; base=N/2+th/2-6*S
md.text((x,base),txt,font=font,anchor="ls",fill=255)
grad=Image.new("RGBA",(N,N))
gp=ImageDraw.Draw(grad)
top=base-th; 
for y in range(N):
    t=max(0,min(1,(y-top)/max(1,th)))
    gp.line([(0,y),(N,y)],fill=tuple(int(goldhi[i]*(1-t)+gold[i]*t) for i in range(3))+(255,))
# soft shadow
sh=mask.filter(ImageFilter.GaussianBlur(10*S))
shadow=Image.new("RGBA",(N,N),(0,0,0,0)); shadow.putalpha(sh.point(lambda v:int(v*0.45)))
img=Image.alpha_composite(img,shadow)
img.paste(grad,(0,0),mask)
d=ImageDraw.Draw(img)
# accent underline
bw=tw*0.34; by=base+40*S
d.rounded_rectangle([N/2-bw/2,by,N/2+bw/2,by+9*S],radius=5*S,fill=gold)
out=img.resize((512,512),Image.LANCZOS).convert("RGB")
out.save(sys.argv[1],optimize=True)
